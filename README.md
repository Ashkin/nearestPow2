# Fast bitwise nearest-power-of-2 in javascript

This works for values up to 30 bits (javascript limitation), with undefined behavior for values < 1.
It also utilizes memozing to speed up subsequent calls with values within range (+/- 1 power).

I originally wrote this as a way to speed up (and decrease CPU usage while) snapping a slider to powers of 2, and it does its job _wonderfully_.


### Usage:
`nearestPow2.get(value)`
Returns the power of 2 nearest to the value you specify.

`nearestPow2.get(value, false)`
This does the same as above, but disables memoizing.  This slightly increases speed when dealing with very wide-ranging values (>= 1 power in either direction)

`nearestPow2.clearBounds()`
This allows you to clear the memoizing data manually.  This is not required, but may slightly speed up the next call if its value is out-of-range.
