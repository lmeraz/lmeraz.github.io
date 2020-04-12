```python
colors = ['$black','$darkerGray','$darkGray','$gray','$lightGray','$white']

inverse_colors = {}
for i in range(len(colors)):
    inverse_colors[colors[i]] = colors[~i]

lines = []
with open('path/to/file') as f:
    for line in f:
        for k,v in inverse_colors.items():
            if k in line:
                line = line.replace(k,v)
                break
        lines.append(line)
print(''.join(lines))
```
