import { memo } from "react";
import Display from "../Display";
import ButtonBar from "../ButtonBar";

function Tab(props) {
  return (
    <div className={props.tab !== 'timer' ? `tab ${props.tab}-tab` : 'tab'}>
      <div className="records-display-container">
        <Display
          isHeader={true}
          headers={props.headers}
          tab={props.tab}
          onClick={(e) => e.stopPropagation()}
        />
        {props.records.length > 0 && props.records.map(record =>
          <Display
            key={record.id}
            isHeader={false}
            headers={props.headers}
            fields={props.fields}
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
