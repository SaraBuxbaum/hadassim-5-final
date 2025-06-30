import pandas as pd
from datetime import timedelta
from multiprocessing import Pool, cpu_count

try:
    import chardet
except ImportError:
    chardet = None

CHUNK_SIZE_DAYS = 1
MAX_WORKERS = cpu_count() or 4
ENCODINGS_TO_TRY = ['utf-8', 'cp1255', 'latin1', 'utf-16']

def detect_encoding(filepath, n_bytes=10000):
    if chardet is None:
        return None
    with open(filepath, 'rb') as f:
        rawdata = f.read(n_bytes)
    result = chardet.detect(rawdata)
    return result.get('encoding')

def read_csv_with_fallback(csv_path, parse_dates=None, dayfirst=True):
    encoding = detect_encoding(csv_path)
    encodings = [encoding] if encoding else []
    for enc in ENCODINGS_TO_TRY:
        if enc not in encodings:
            encodings.append(enc)
    last_exc = None
    for enc in encodings:
        try:
            df = pd.read_csv(csv_path, parse_dates=parse_dates, dayfirst=dayfirst, encoding=enc)
            print(f"Read CSV with encoding: {enc}")
            return df
        except Exception as e:
            last_exc = e
            print(f"Failed with encoding {enc}: {e}")
    raise last_exc or ValueError("Could not read CSV with tried encodings.")

def convert_csv_to_parquet(csv_path):
    parquet_path = csv_path.rsplit('.', 1)[0] + ".parquet"
    df = read_csv_with_fallback(csv_path, parse_dates=[0], dayfirst=True)
    df.to_parquet(parquet_path, index=False)
    print(f"Converted {csv_path} to {parquet_path}")
    return parquet_path

def read_file(file_path):
    if file_path.lower().endswith(".csv"):
        parquet_path = convert_csv_to_parquet(file_path)
        return pd.read_parquet(parquet_path)
    elif file_path.lower().endswith(".parquet"):
        return pd.read_parquet(file_path)
    else:
        raise ValueError("Unsupported file format")

def save_file(df, file_path):
    output_path = file_path if file_path.lower().endswith(".csv") else file_path.rsplit('.', 1)[0] + ".csv"
    df.rename(columns={'hour': 'timestamp'}, inplace=True)
    df.to_csv(output_path, index=False)
    print(f"Saved to {output_path}")

def clean_data(df):
    if isinstance(df, str):
        raise TypeError("Expected a DataFrame, but got a string.")
    df.columns = df.columns.str.strip().str.lower()
    if df.shape[1] != 2:
        raise ValueError(f"Expected exactly 2 columns, but got {df.shape[1]}")
    time_col, value_col = df.columns[:2]
    df[time_col] = pd.to_datetime(df[time_col], errors='coerce')
    df[value_col] = pd.to_numeric(df[value_col], errors='coerce')
    df = df.dropna(how='all').drop_duplicates()
    df = df.dropna(subset=[time_col, value_col])
    df = df.sort_values(time_col)
    return df.rename(columns={time_col: 'timestamp', value_col: 'value'})

def generate_chunk_ranges(df, chunk_days=CHUNK_SIZE_DAYS):
    start = df['timestamp'].min().floor('D')
    end = df['timestamp'].max().ceil('D')
    return [(start + timedelta(days=i), start + timedelta(days=i + chunk_days))
            for i in range(0, (end - start).days, chunk_days)]

def avg_for_hour(df):
    df = df.copy()
    df['hour'] = df['timestamp'].dt.floor('h')
    grouped = df.groupby('hour').agg(sum_val=('value', 'sum'), count=('value', 'count')).reset_index()
    grouped['average'] = grouped['sum_val'] / grouped['count']
    return grouped[['hour', 'sum_val', 'count']]

def process_chunk(df, time_range):
    start, end = time_range
    chunk = df[(df['timestamp'] >= start) & (df['timestamp'] < end)]
    if chunk.empty:
        return pd.DataFrame(columns=['hour', 'sum_val', 'count'])
    return avg_for_hour(chunk)

def process_all_chunks(df, chunk_ranges):
    args = [(df, chunk_range) for chunk_range in chunk_ranges]
    with Pool(processes=MAX_WORKERS) as pool:
        results = pool.starmap(process_chunk, args)
    return pd.concat(results, ignore_index=True)

def merge_results(df):
    merged = df.groupby('hour', as_index=False).agg({
        'sum_val': 'sum',
        'count': 'sum'
    })
    merged['average'] = merged['sum_val'] / merged['count']
    return merged[['hour', 'average']]

def main(input_path, output_path):
    df = read_file(input_path)
    df = clean_data(df)
    chunk_ranges = generate_chunk_ranges(df)
    processed_chunks = process_all_chunks(df, chunk_ranges)
    final_df = merge_results(processed_chunks)
    save_file(final_df, output_path)

if __name__ == '__main__':
    main("time_series.csv", "averaged_time_series.csv")
