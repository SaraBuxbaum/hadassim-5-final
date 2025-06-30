import pandas as pd
import sys
from datetime import datetime

def read_and_clean(file_path):
    df = pd.read_csv(file_path, parse_dates=[0], dayfirst=True)
    df.columns = df.columns.str.strip().str.lower()
    df = df.dropna(how='all').drop_duplicates()
    df = df.rename(columns={df.columns[0]: 'timestamp', df.columns[1]: 'value'})
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df['value'] = pd.to_numeric(df['value'], errors='coerce')
    df = df.dropna(subset=['timestamp', 'value'])
    df = df.sort_values(by='timestamp')
    return df

def average_per_hour(df):
    df['hour'] = df['timestamp'].dt.floor('h')
    result = df.groupby('hour')['value'].mean().reset_index(name='average')
    return result

if __name__ == '__main__':
    input_path = sys.argv[1] if len(sys.argv) > 1 else 'time_series.csv'
    df = read_and_clean(input_path)
    hourly_avg = average_per_hour(df)
    print(hourly_avg.to_string(index=False))
