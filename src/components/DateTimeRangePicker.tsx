import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

interface DateTimeRangePickerProps {
  onDateTimeRangeChange: (startDateTime: string, endDateTime: string) => void;
}

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  onDateTimeRangeChange,
}) => {
  const [startDateTime, setStartDateTime] = useState<Date | null>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date | null>(new Date());

  const handleStartDateTimeChange = (date: Date) => {
    setStartDateTime(date);
    if (date && endDateTime) {
      onDateTimeRangeChange(
        format(date, "yyyyMMdd'T'HHmm"),
        format(endDateTime, "yyyyMMdd'T'HHmm")
      );
    }
  };

  const handleEndDateTimeChange = (date: Date) => {
    setEndDateTime(date);
    if (startDateTime && date) {
      onDateTimeRangeChange(
        format(startDateTime, "yyyyMMdd'T'HHmm"),
        format(date, "yyyyMMdd'T'HHmm")
      );
    }
  };

  return (
    <div className="flex flex-col py-2.5 px-3.5 gap-3 border bg-white">
      <div className="flex flex-row gap-2">
        <label className="w-12 font-semibold mt-1">From:</label>
        <DatePicker
          selected={startDateTime}
          onChange={handleStartDateTimeChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          className="flex- date-picker w-full block appearance-none 
                   bg-gray-200 border border-gray-200 text-gray-700 
                     py-1 px-4 pr-8 rounded leading-tight focus:outline-none 
                     focus:bg-white focus:border-gray-500 cursor-pointer"
        />
      </div>
      <div className="flex flex-row gap-2">
        <label className="w-12 font-semibold mt-1">To:</label>
        <DatePicker
          selected={endDateTime}
          onChange={handleEndDateTimeChange}
          showTimeSelect
          dateFormat="yyyy-MM-dd HH:mm"
          className="date-picker w-full block appearance-none 
                   bg-gray-200 border border-gray-200 text-gray-700 
                     py-1 px-4 pr-8 rounded leading-tight focus:outline-none 
                   focus:bg-white focus:border-gray-500 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DateTimeRangePicker;
