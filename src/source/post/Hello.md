---
title: Hello, Flyblog
date: 2021-11-09 11:25
categories:
- Hello
tags:
- Hello
---

# Hello, Flyblog

When you see this post, your flyblog was successfully running!

```C++
#include <iostream>
using namespace std;
 
int main() {
    cout << "Hello, World!";
    return 0;
}
```

$$
f(k)=\sum_{i=1}^n \sum_{j=1}^m \lfloor \frac ni \rfloor  \lfloor \frac mj \rfloor [\gcd(i, j)=k] \\
g(k) = \sum_{i=1}^{\lfloor \frac nk \rfloor}f(ki) \\
$$
$$
g(k) =\sum_{i=1}^n \sum_{j=1}^m \lfloor \frac ni \rfloor  \lfloor \frac mj \rfloor [k|\gcd(i, j)]
$$
$$
g(k) =\sum_{i=1}^{\lfloor \frac nk \rfloor} \sum_{j=1}^{\lfloor \frac mk \rfloor} \lfloor \frac n{ik} \rfloor  \lfloor \frac m{jk} \rfloor
$$
$$
f(1)=\sum_{d=1}^n \mu(d) \sum_{i=1}^{\lfloor \frac nd \rfloor} \sum_{j=1}^{\lfloor \frac md \rfloor} \lfloor \frac n{di} \rfloor  \lfloor \frac m{dj} \rfloor
$$

<!-- more -->

