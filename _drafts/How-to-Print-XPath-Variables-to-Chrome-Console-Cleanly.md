---
layout: post
title: How to Print XPath Variables to Chrome Console Cleanly
---
How to print xpath variables to console log cleanly
$x('//*[@id="table-targetrelations"]/tbody/tr/td[1]/a/text()').map(function(el){return el.data}).join("\n")
