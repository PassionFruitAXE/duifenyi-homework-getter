import axios from "axios";
import { BACKEND_PREFIX } from "./config";
import { FC, useEffect, useState } from "react";

const App: FC = () => {
  const [list, setList] = useState("");

  useEffect(() => {
    axios
      .post(`${BACKEND_PREFIX}/getHomework`, {
        loginname: "shallowwind",
        password: "Lw13708137873",
      })
      .then(response => {
        setList(response.data.data);
      });
  }, []);

  return <div className="text-xs">{list}</div>;
};

export default App;
