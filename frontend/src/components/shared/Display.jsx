import Popup from "./popup/Popup";
import { useState, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { timeForDisplay } from "../../utils/helpers";

const defaultHandicap = 1;

// updates data to display "last name, first name" if names present in headers
// updates data to display adjusted time for timeAdjusted header in results
function transformData({ data, tab }) {
  if (!data) return null;
  if (tab === 'category') { return data };
  const { first_name, last_name, time_raw, ...other } = data;

  let transObject = { ...other };

  if (first_name || last_name) {
    transObject.name = `${last_name ?? ""}, ${first_name ?? ""}`;
  }

  if (time_raw) {
    let timeToDisplay = (tab === 'result') ? (time_raw * (data?.handicap || defaultHandicap)) : time_raw;
    transObject.time_raw = timeForDisplay(timeToDisplay);
    transObject.timeAdjusted = timeForDisplay(timeToDisplay);
  };

  return transObject;
};

function Display(props) {
  const { t } = useTranslation();
  const [isDisplayed, setIsDisplayed] = useState(false);
  const [buttonTypes, setButtonTypes] = useState([]);
  const [crud, setCrud] = useState([]);

  const shouldDisplayData = !props.isHeader && props.data !== null;
  const editButtonTypes = ['cancel', 'update', 'delete'];
  const displayData = useMemo(() => transformData(
    { data: props.data, tab: props.tab }), [props.data, props.tab]
  );

  // useState to set up headers BEFORE first render to avoid flash on screen
  // condenses first and last names to 'name' in header
  // changes time_raw to timeAdjusted header for result tab
  const [updatedHeaders] = useState(() => {
    if (!props.headers) { return [] };
    const hasNameField = props.headers.includes('first_name') ||
      props.headers.includes('last_name');
    const resultTabTime = props.tab === 'result' && props.headers.includes('time_raw');
    let newHeaders = [...props.headers];

    if (hasNameField) {
      newHeaders = newHeaders
        .filter(header => header !== 'first_name' && header !== 'last_name')
        .concat('name');
    }
    if (resultTabTime) {
      newHeaders = newHeaders
        .filter(header => header !== "time_raw")
        .concat('timeAdjusted');
    }
    return newHeaders;
  });

  function handlePopUp() {
    if (props.tab === "result") { return };
    setIsDisplayed(!isDisplayed);
    setButtonTypes(editButtonTypes);
    setCrud('edit');
  };


  return (
    <div>
      <div
        data-testid={props.isHeader ? `${props.tab}-header-row` : `${props.tab}-row`}
        className={`display-container ${props.tab}-display-grid`}
        onClick={!props.isHeader ? handlePopUp : undefined}
      >
        {updatedHeaders.map((header) => (
          <p
            id={header}
            key={header}
            data-testid={props.isHeader ? `${props.tab}-header-value` : `${props.tab}-row-value`}
          >
            {shouldDisplayData
              ? (displayData?.[header] ?? "")
              : <strong>{t(header)}</strong>
            }
          </p>
        ))}
      </div>

      {/* ------------- POPUP ------------- */}
      <div>
        {isDisplayed && <Popup
            key={props.data?.id ?? crypto.randomUUID()}
            setIsDisplayed={setIsDisplayed}
            data={props.data}
            tab={props.tab}
            crud={crud}
            popUpFields={props.fields}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            categories={props.categories}
            setDisplayRecords={props.setDisplayRecords}
            fetchRecord={props.fetchRecord}
            update={props.update}
            edit={props.edit}
            delete={props.delete}
          />
        }
      </div>
    </div>
  );
}

export default memo(Display);
