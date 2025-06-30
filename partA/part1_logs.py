import pandas as pd
from collections import Counter

# Reading the file
file_path = r"logs.xlsx"
df = pd.read_excel(file_path, engine="openpyxl", header=None)

# Extracting error codes from each line
lines = df[0].dropna().astype(str).tolist()
error_codes = [line.split("Error: ")[1].strip() for line in lines if "Error:" in line]

# Splitting into chunks (in case we want to process in parts)
chunk_size = 100000
chunks = [error_codes[i:i + chunk_size] for i in range(0, len(error_codes), chunk_size)]

# Counting frequencies in each chunk
chunk_counters = [Counter(chunk) for chunk in chunks]

# Merging all counters
total_counter = Counter()
for counter in chunk_counters:
    total_counter.update(counter)

# Selecting the N most common errors
N = 5
most_common_errors = total_counter.most_common(N)

# Printing the results
print(f"\nTop {N} most common error codes:\n")
for code, count in most_common_errors:
    print(f"Code: {code}, Occurrences: {count}")
    indices = [i for i, err in enumerate(error_codes) if err == code]
    print(f"Example indices: {indices[:5]}{'...' if len(indices) > 5 else ''}\n")


print(f"Total unique error codes: {len(total_counter)}")

"""
------------------------
Time and Space Complexity Analysis:
Let:
- L = number of lines in the Excel file
- S = average length of each line
- E = number of unique error codes
- N = number of top errors to return (e.g., 5)
- K = average number of appearances per top error

Time Complexity:
- Reading and parsing lines: O(L × S)
- Extracting error codes: O(L × S)
- Splitting into chunks: O(L)
- Counting frequencies per chunk: O(L)
- Merging counters: O(E)
- Finding top-N errors: O(E log N)
- Searching for indices of top errors: O(L × N)
 Total: O(L × (S + N) + E log N)

Space Complexity:
- List of raw lines and error codes: O(L)
- Counters (merged): O(E)
- Top-N indices (optional): O(K × N)
 Total: O(L + E + K × N)
------------------------
"""




