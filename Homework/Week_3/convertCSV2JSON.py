# convertCSV2JSON.py
# Simon Kemmere
# 10798250
# Convert .csv data to JSON using an as generically possible code, so it's
# easy to use when coding in the future. Use D3 to transform JSONified data
# into a barchart.

import csv
import json

# open csv file
with open ("Average_salary.csv") as csv_file:

    # format each line into a seperate dict and make a list of all dicts
    field_names = ("Club", "Average_salary")
    reader = list(csv.DictReader(csv_file, field_names))

# write list with dicts to json file
with open('Average_salary.json', 'w') as json_file:
    json.dump(reader,json_file)
