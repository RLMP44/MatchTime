import { useState, memo } from "react";
import Display from "../Display";
import ButtonBar from "../ButtonBar";

function Tab(props) {
  const [isDisplayed, setIsDisplayed] = useState(false);

  function handlePopUp() {
    setIsDisplayed(!isDisplayed);
  }

  return (
    <div className={props.tab !== 'timer' ? `tab ${props.tab}-tab` : 'tab'}>
      <div className="records-display-container" onClick={handlePopUp}>
        <Display headers={props.headers} tab={props.tab} />
        {props.records.map(record =>
          <Display
            key={record.id}
            headers={props.headers}
            fields={props.fields}
            setIsDisplayed={setIsDisplayed}
            data={record}
            tab={props.tab}
            categories={props.categories}
            setDisplayRecords={props.setDisplayRecords}
            fetchRecord={props.fetchRecord}
            update={props.update}
            edit={props.edit}
            delete={props.delete}
          />
        )}
      </div>

      {props.tab !== 'timer' && <ButtonBar
                                  tab={props.tab}
                                  add={props.add}
                                  categories={props.categories}
                                  fieldsObj={props.fieldsObj}
                                />
      }
    </div>
  );
}

export default memo(Tab);
