import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPropmt, setPrevPropmt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loding, setLoding] = useState(false);
  const [resultData, setResultData] = useState("");
  const delayPara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };
  const newChat = () => {
    setLoding(false);
    setShowResult(false);
  };
  const onSent = async (prompt) => {
    setResultData("");
    setLoding(true);
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPropmt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }
    // setRecentPrompt(input);
    // setPrevPropmt((prev) => [...prev, input]);
    // const response = await runChat(input);
    let responseArray = response.split("**");
    let newArray = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += responseArray[i];
      } else {
        newArray += "<b>" + responseArray[i] + "</b>";
      }
    }
    let newArray2 = newArray.split("*").join("</br>");
    // setResultData(response);
    // setResultData(newArray);
    // setResultData(newArray2);
    let newResponseArray = newArray2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextword = newResponseArray[i];
      delayPara(i, nextword + " ");
    }
    setLoding(false);
    setInput("");
  };

  const ContextValue = {
    prevPropmt,
    setPrevPropmt,
    onSent,
    recentPrompt,
    setRecentPrompt,
    loding,
    resultData,
    showResult,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={ContextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
