/** @format */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../E-CommerceAdmin/pages/Chat/firebase";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const valueReturner = (holder, string) => {
  return holder ? (
    <div className="Desc-Container">
      <p className="title"> {string} </p>
      <p className="desc"> {holder} </p>
    </div>
  ) : (
    ""
  );
};

export const PhoneNumberFormatter = (value) => {
  const number = value?.replace(/\D/g, "");
  const countryCode = number?.slice(0, 1);
  const bracketCode = number?.slice(1, 4);
  const another = number?.slice(4, 7);
  const remaining = number?.slice(7);
  return `+${countryCode}(${bracketCode})${another}-${remaining}`;
};

export const copyText = ({ textToCopy, setCopied }) => {
  navigator.clipboard.writeText(textToCopy);
  setCopied(true);
  setTimeout(() => {
    setCopied(false);
  }, 1000);
};

//  01:00 PM , 26 March Date formation like this or MM/DD/YYYY
export const formatInHour = ({ date, setMonth, setHour, setDay }) => {
  const start = new Date(date);
  const dayFormated = start?.getDate();
  const dayInNum = dayFormated < 10 ? `0${dayFormated}` : dayFormated;
  const startingTime = start?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const month = start?.toLocaleDateString("en-US", {
    month: "long",
  });
  setMonth(month);
  setHour(startingTime);
  setDay(dayInNum);
};

// MM/DD/YYYY
export const inMonthFomat = (date) => {
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

// Min // Time // Hour
export const TimeFormatter = ({ value, setTime, setMin }) => {
  setTime(value);
  const hoursAndMinutesMatch = value.match(/(\d+)\s*hr(?:\s*(\d*)\s*min)?/);
  const onlyHoursMatch = value.match(/(\d+)\s*hr/);
  const onlyMinutesMatch = value.match(/(\d+)\s*min/);
  if (hoursAndMinutesMatch) {
    const hours = parseInt(hoursAndMinutesMatch[1]) || 0;
    const minutes = parseInt(hoursAndMinutesMatch[2]) || 0;
    setMin(hours * 60 + minutes);
  } else if (onlyHoursMatch) {
    console.log("On Hours");
    const hours = parseInt(onlyHoursMatch[1]) || 0;
    setMin(hours * 60);
  } else if (onlyMinutesMatch) {
    const minutes = parseInt(onlyMinutesMatch[1]) || 0;
    setMin(minutes);
  } else {
    console.error("Invalid input format.");
  }
};

export const getServiceDate = (time) => {
  const updateTime = new Date(time);
  const timezoneOffset = updateTime?.getTimezoneOffset();
  const adjustedTime = new Date(updateTime.getTime() + timezoneOffset * 60000);
  const month = adjustedTime.getMonth() + 1;
  const day = adjustedTime.getDate();
  const year = adjustedTime.getFullYear();
  const hasAll = month && year && day;
  const TimeForm = adjustedTime?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return (
    hasAll &&
    `${month <= 9 ? `0${month}` : month}/${
      day <= 9 ? `0${day}` : day
    }/${year} ${TimeForm} `
  );
};

export function roundToTwo(num) {
  return parseFloat(num?.toFixed(2));
}

export const debouncedSetQuery = (term, setQuery) => {
  clearTimeout(debouncedSetQuery.timeoutId);
  debouncedSetQuery.timeoutId = setTimeout(() => {
    setQuery(term);
  }, 500);
};

// firbase login
export const SignInFirebase = ({ payload }) => {
  const { email, password } = payload;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential.user);
    })
    .catch((error) => {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-login-credentials"
      ) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log(userCredential.user);
          })
          .catch((error) => {
            console.error("Error creating account:", error);
          });
      } else {
        console.error("Error signing in:", error);
      }
    });
};

export const firebaseSignOut = async () => {
  try {
    await auth.signOut();
  } catch (e) {
    console.log(e);
  }
};

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};
