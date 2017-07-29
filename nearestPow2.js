(function(nearestPow2) {

  // Private vars
  var lower_bound, upper_bound, current_power, next_power, prev_power, val_copy, shift_count


  // Clear bounds data used by memoizing
  nearestPow2.clearBounds = function() {
    // Leaving the stored bounds intact does not cause incorrect results.
    // clearing them, however, slightly speeds up any subsequent calls with too-far-out-of-bounds values (>=1 power in either direction)
    //   ex: nearestPow2.get(255)  then  nearestPow2.get(1023)
    lower_bound = null
    upper_bound = null
  }



  // As this is kind of hard to read, I've added comments describing the bitwise math I've used.
  // Works for values up to 30 bits (javascript limitation)
  // Undefined behavior for values < 1
  nearestPow2.get = function(val, memoize=true) {
    // Memoize to speed up subsequent calls with similar values
    if (memoize && !!lower_bound && !!upper_bound) {  // Skip entire block if bounds are undefined/incorrect
      // no change?
      if (val == current_power)
        return current_power

      // Prev/Next powers are guaranteed powers of 2, so simply return them.
      if (val == next_power) {
        nearestPow2.clearBounds()  // Clear bounds to speed up the next call
        return next_power
      }

      if (val == prev_power) {
        nearestPow2.clearBounds()
        return prev_power
      }


      // Halfway bounds allow quick rounding:
      //  - Within bounds
      if ((val > current_power  &&  val < upper_bound)  ||  (val < current_power  &&  val >= lower_bound))
        return current_power

      //  - Between upper bound and next power
      if (val >= upper_bound && val <= next_power) {
        nearestPow2.clearBounds()
        return next_power
      }

      //  - Between lower bound and previous power
      if (val < lower_bound && val >= prev_power) {
        nearestPow2.clearBounds()
        return prev_power
      }
    }


    // Already a power of 2? simply return it.
    // (As this scenario is rare, checking likely lowers performance)
    if ((val & (val-1)) == 0)   // This will be nonzero (and therefore fail) if there are multiple bits set.
      return val


    // Round to nearest power of 2 using bitwise math:
    val         = ~~val  // Fast floor via double bitwise not
    val_copy    = val
    shift_count = 0
    // Count the number of bits to the right of the most-significant bit:  111011 -> 5
    while (val_copy > 1) {
      val_copy = val_copy >>> 1   // >>> left-fills with zeros
      shift_count++
    }

    // If the value's second-most-significant bit is set (meaning it's halfway to the next power), add a shift to round up
    if (val & (1 << (shift_count - 1)))
      shift_count++

    // Construct the power by left-shifting  --  much faster than Math.pow(2, shift_count)
    val = 1 << shift_count

    // Shortcut if not memoizing
    if (! memoize)
      return val

    // ... and memoize by storing halfway bounds and the next/prev powers
    next_power    = val <<  1
    upper_bound   = val + (val >>> 1)          // Halfway up   (x*1.5)
    current_power = val
    lower_bound   = (val >>> 1) + (val >>> 2)  // Halfway down (x/2 + x/4)
    prev_power    = val >>> 1

    // Return our shiny new power of 2 (:
    return val
  }

})(window.nearestPow2 = window.nearestPow2 || {})