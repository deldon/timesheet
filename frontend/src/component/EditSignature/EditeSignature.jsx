import "./style.scss";
import { useQuery, useMutation, useQueryClient } from "react-query";
import request from "../../request/query/request";
import requestMutation from "../../request/mutation/request";
import Spinner from "../Spinner/Spinner";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";
import { useState } from "react";

function EditeSignature({ signatureId, toggelHandelClose }) {
  const [printError, setError] = useState("");

  const queryClient = useQueryClient();
  const mutation = useMutation(requestMutation.updateSignature, {
    onSuccess: () => queryClient.invalidateQueries(["mycours"]),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  //   let { id } = useParams();
  //   let signatureId = id;

  const { isLoading, error, data, isFetching } = useQuery(
    ["coursById", signatureId],
    async () => {
      const data = await request.myCoursById(signatureId);
      return data;
    },
    {
      //keepPreviousData: true,
      onSuccess: (data) => {
        data.signature_date = dayjs(data.signature_date).format("YYYY-MM-DD");
        reset(data);
      },
    }
  );

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred: " + error.message;

  const onSubmit = (data) => {
    const startTime = dayjs(data.start_time, "HH:mm");
    const endTime = dayjs(data.end_time, "HH:mm");
    if (endTime.isAfter(startTime)) {
      mutation.mutate(data);
      toggelHandelClose();
    } else {
      setError(`Attention, l'heure de début est supérieure à l'heure de fin.`);
    }

    // mutation.mutate(e);
    // reset(data);
    // toggelHandelClose();
  };

  return (
    <div className="post-signature">
      <div className="post-signature-close">
        <img
          className="post-signature-close"
          onClick={toggelHandelClose}
          src="./icones/RiCloseCircleFill.svg"
        />
      </div>
      <div className="post-signature-form-error">{printError}</div>
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

export default EditeSignature;
