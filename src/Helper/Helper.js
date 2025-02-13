/** @format */
import ReactQuill from "react-quill";
import Form from "react-bootstrap/Form";

export const TableImage = (img) => {
  return img && <img src={img} alt="" className="Table_image" />;
};

export const Mail = (mail) => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${mail}`;
  window.location.href = gmailUrl;
};

/** @format */

export const Call = (number) => {
  window.location.href = `tel:+${number}`;
};

export const SendSms = (number) => {
  const smsUrl = `sms:+${number}`;
  window.location.href = smsUrl;
};

export const EditorDesciption = ({ setDescription, description, label }) => {
  return (
    <Form.Group className="mb-3 quill-container">
      <Form.Label> {label} </Form.Label>
      <ReactQuill
        value={description}
        onChange={(value) => setDescription(value)}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            ["link"],
          ],
        }}
        formats={[
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          "list",
          "bullet",
          "indent",
          "link",
        ]}
      />
    </Form.Group>
  );
};

export const ViewDescription = ({ description }) => {
  return <div dangerouslySetInnerHTML={{ __html: description }} />;
};

export const DateFormatter = (time) => {
  const myOr = new Date(time);
  const formattedOriginalDate = myOr.toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const updatedDate = new Date(formattedOriginalDate);
  return updatedDate;
};

export const ConvertInMin = (value, setTime, setMinutes) => {
  setTime(value);

  const hoursAndMinutesMatch = value.match(/(\d+)\s*hr(?:\s*(\d*)\s*min)?/);
  const onlyHoursMatch = value.match(/(\d+)\s*hr/);
  const onlyMinutesMatch = value.match(/(\d+)\s*min/);

  if (hoursAndMinutesMatch) {
    const hours = parseInt(hoursAndMinutesMatch[1]) || 0;
    const minutes = parseInt(hoursAndMinutesMatch[2]) || 0;
    setMinutes(hours * 60 + minutes);
  } else if (onlyHoursMatch) {
    const hours = parseInt(onlyHoursMatch[1]) || 0;
    setMinutes(hours * 60);
  } else if (onlyMinutesMatch) {
    const minutes = parseInt(onlyMinutesMatch[1]) || 0;
    setMinutes(minutes);
  } else {
    console.error(
      'Invalid input format. Please use the format like "1hr 30min", "2hr", "30min", "45min", etc.'
    );
  }
};

export const getCorrectTime = (time) => {
  const updateTime = new Date(time);
  const timezoneOffset = updateTime?.getTimezoneOffset();
  const adjustedTime = new Date(updateTime.getTime() + timezoneOffset * 60000);
  return adjustedTime;
};

export const DateInMMDDYY = (date) => {
  const originalDate = new Date(date);
  const timezoneOffset = originalDate?.getTimezoneOffset();
  const adjustedTime = new Date(
    originalDate?.getTime() + timezoneOffset * 60000
  );
  const year = adjustedTime?.getFullYear();
  const month = adjustedTime?.getMonth() + 1;
  const day = adjustedTime?.getDate();

  return `${month < 10 ? `0${month}` : month}/${
    day < 10 ? `0${day}` : day
  }/${year}`;
};
