import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import request from "../../request/query/request";
import Spinner from "../Spinner/Spinner";
import * as XLSX from "xlsx";
import "./style.scss";

const DateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [dates, setDates] = useState({ start: null, end: null });
  const [shouldGenerateExcel, setShouldGenerateExcel] = useState(false);

  const fetchDates = async ({ queryKey }) => {
    const [_, start, end] = queryKey;
    const data = await request.getRecapSignatureByInterval(start, end);
    return data;
  };

  const { isLoading, error, data } = useQuery(
    ["getRecapSignatureByInterval", dates.start, dates.end],
    fetchDates,
    {
      enabled: !!dates.start && !!dates.end,
      refetchOnWindowFocus: false,
      staleTime: 0,
      cacheTime: 0,
      refetchInterval: 0,
    }
  );

  useEffect(() => {
    if (data && shouldGenerateExcel) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feuille1");
      XLSX.writeFile(wb, `Recap ${dates.start} / ${dates.end}` + ".xlsx");
      setShouldGenerateExcel(false); // Reset the flag
    }
  }, [data, shouldGenerateExcel, dates.start, dates.end]);

  const onSubmit = (formData) => {
    setDates({
      start: formData.start,
      end: formData.end,
    });
    setShouldGenerateExcel(true);
  };

  if (isLoading) return <Spinner />;

  if (error) return <div>An error has occurred: {error.message}</div>;

  return (
    <div className="RecapInvalid">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="RecapInvalid_form">
          <div className="RecapInvalid_from_box">
            <label htmlFor="start">Debu: </label>
            <input
              type="date"
              id="start"
              {...register("start", { required: "Start date is required" })}
            />
            {errors.start && <p>{errors.start.message}</p>}
          </div>

          <div className="RecapInvalid_from_box">
            <label htmlFor="end">Fin: </label>
            <input
              type="date"
              id="end"
              {...register("end", { required: "End date is required" })}
            />
            {errors.end && <p>{errors.end.message}</p>}
          </div>
        </div>
        <button className="RecapInvalid_from_submit" type="submit">
          Exporter
        </button>
      </form>
    </div>
  );
};

export default DateForm;
