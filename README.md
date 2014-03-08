## Line by line text file parser

### Goal
Parse large text files line by line.

The existing modules trying to do this all have issues:
* missing last line if no final carriage return
* use time consuming array operations
* memory leaks

### Benchmark
There is a benchmark testbed with larger files that will be added to a separate repo.
