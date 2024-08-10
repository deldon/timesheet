import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import "./style.scss";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import request from "../../request/mutation/request";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";

dayjs.extend(customParseFormat);

function PostSignature({ studyId, teacherId, setToggelPost }) {
  const [error, setError] = useState("");

  const handelClose = () => {
    setToggelPost(false);
  };

  const dateNow = dayjs().format("YYYY-MM-DD");
  const yourNow = dayjs().format("HH:mm");
  const yourStart = dayjs().subtract(1, "hour").format("HH:mm");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      student_id: studyId,
      teacher_id: teacherId,
      signature_date: dateNow,
      start_time: yourStart,
      end_time: yourNow,
      shifting: true,
    },
  });

  const mutation = useMutation(request.newSignature);

  const navigate = useNavigate();

  if (mutation.isSuccess) {
    setToggelPost(false);
    navigate("/mycours");
  }

  if (mutation.error) {
  }

  const onSubmit = (data) => {
    const startTime = dayjs(data.start_time, "HH:mm");
    const endTime = dayjs(data.end_time, "HH:mm");

    if (endTime.isAfter(startTime)) {
      mutation.mutate(data);
    } else {
      setError(`Attention, l'heure de début est supérieure à l'heure de fin.`);
    }
  };

  return (
    <div className="post-signature">
      <div className="post-signature-close">
        <img
          className="post-signature-close"
          onClick={handelClose}
          src="./icones/RiCloseCircleFill.svg"
        />
      </div>
      <div className="post-signature-form-error">{error}</div>
      <form className="post-signature-form" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("student_id")} />

        <input type="hidden" {...register("teacher_id")} />

        <div className="post-signature-form-box">
          <label>Date du cours</label>
          <input
            type="date"
            className={errors.signature_date?.type === "required" && "red"}
            {...register("signature_date", { required: true })}
            aria-invalid={errors.signature_date ? "true" : "false"}
          />
        </div>

        <div className="post-signature-form-box">
          <label>Heure de début</label>
          <input
            className={errors.start_time?.type === "required" && "red"}
            type="time"
            {...register("start_time", { required: true })}
            aria-invalid={errors.start_time ? "true" : "false"}
          />
        </div>

        <div className="post-signature-form-box">
          <label>Heure de fin</label>
          <input
            className={errors.end_time?.type === "required" && "red"}
            type="time"
            {...register("end_time", { required: true })}
            aria-invalid={errors.end_time ? "true" : "false"}
          />
        </div>

        <div className="post-signature-form-box-check">
          <div className="post-signature-form-box">
            <label>Trajet ?</label>
            <input
              type="checkbox"
              className={errors.shifting?.type === "required" && "red"}
              {...register("shifting")}
              aria-invalid={errors.shifting ? "true" : "false"}
            />
          </div>
          <div className="post-signature-form-box">
            <label>Absent ?</label>
            <input
              type="checkbox"
              className={errors.shifting?.type === "required" && "red"}
              {...register("is_absent")}
              aria-invalid={errors.shifting ? "true" : "false"}
            />
          </div>
        </div>

        <input className="post-signature-form-submit" type="submit" />
      </form>
    </div>
  );
}

export default PostSignature;
