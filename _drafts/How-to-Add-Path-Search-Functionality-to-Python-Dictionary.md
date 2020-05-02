---
layout: post
title: How to Add Path Search Functionality to Python Dictionary
---

class PathDict(dict):
    def get(self, path, default=None):
        keys = path.split('.')
        for key in keys:
            self = self[key]
