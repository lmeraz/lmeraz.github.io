Normalizing a Hashmap


def normalize(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            del obj[k]
            if k=''
            obj[k.lower()] = normalize(v)
        return obj
    elif isinstance(obj, list):
        for i in range(len(obj)):
            obj[i] = normalize(obj[i])
        return obj
    elif isinstance(obj, str):
        return obj.lower()
    elif isinstance(obj, date):
        return str(obj)
