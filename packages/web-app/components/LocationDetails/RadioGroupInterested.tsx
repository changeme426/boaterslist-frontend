import { useState } from "react";
import { Input } from "../Forms/Input"

type PropsType = {
  valueInput?: any;
  name: string;
  onChange: any
};

export default function RadioGroup({ valueInput, name, onChange }: PropsType) {
  const [checkedInput, setCheckedInput] = useState(valueInput)
  return (
    <>
      <div>
        <Input
          style={{ marginBottom: 10, marginTop: 5 }}
          value={"yes"}
          checked={checkedInput === "yes"}
          inputType={"radio"}
          name={name}
          label={"Yes, get me to the top of the list"}
          onChange={() => { setCheckedInput("yes"), onChange("yes") }} />
      </div>
      <div>
        <Input
          value={"no"}
          id={'interested-no'}
          name={name}
          checked={checkedInput === "no"}
          inputType={"radio"}
          label={"No, I'll stick with the free version"}
          onChange={() => {
            setCheckedInput("no")
            onChange("no")
          }} />
      </div>
    </>
  )

}
