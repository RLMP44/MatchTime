import { useState } from "react";
import Display from "./shared/Display";
import ButtonBar from "./shared/ButtonBar";

function Tab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className="tab">
      <div className="records-display-container" onClick={handlePopUp}>
        <Display headers={props.headers} />
        {props.records.map(record =>
          <Display
            key={record.id}
            headers={props.headers}
            setIsDisplayed={setIsDisplayed}
            data={record}
            tab={props.tab}
            setDisplayRecords={props.setDisplayRecords}
            edit={props.edit}
            delete={props.delete}
          />
        )}
      </div>

      <ButtonBar
        tab={props.tab}
        add={props.add}
      />
    </div>
  );
}

export default Tab;
