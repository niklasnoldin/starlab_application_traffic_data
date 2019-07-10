import React from "react";
export function InputField({ day, setDay, timestamp, setTimestamp }) {
  return (
    <div className="input-field">
      <form action="">
        <label htmlFor="">
          Date:
          <input
            type="date"
            name="date"
            value={`2019-05-${`${day}`.padStart(2, "0")}`}
            min="2019-05-01"
            max="2019-05-31"
            onChange={e => {
              setDay(parseInt(e.target.value.substring(8)));
              setTimestamp(
                `${timestamp.substring(0, 6)}${`${e.target.value.substring(
                  8
                )}`.padStart(2, "0")}${timestamp.substring(8)}`
              );
            }}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            step={60 * 5}
            value={`${timestamp.substring(8, 10)}:${timestamp.substring(
              10,
              12
            )}`}
            onChange={e =>
              setTimestamp(
                `201905${`${day}`.padStart(2, "0")}${e.target.value.substring(
                  0,
                  2
                )}${e.target.value.substring(3)}`
              )
            }
          />
        </label>
      </form>
    </div>
  );
}
