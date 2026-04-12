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
  const { fName, lName, timeRaw, ...other } = data;

  let transObject = { ...other };

  if (fName || lName) {
    transObject.name = `${lName ?? ""}, ${fName ?? ""}`;
  }

  if (timeRaw) {
    let timeToDisplay = (tab === 'result') ? (timeRaw * (data?.handicap || defaultHandicap)) : timeRaw;
    transObject.timeRaw = timeForDisplay(timeToDisplay);
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
  // changes timeRaw to timeAdjusted header for result tab
  const [updatedHeaders] = useState(() => {
    if (!props.headers) { return [] };
    const hasNameField = props.headers.includes('fName') ||
      props.headers.includes('lName');
    const resultTabTime = props.tab === 'result' && props.headers.includes('timeRaw');
    let newHeaders = [...props.headers];

    if (hasNameField) {
      newHeaders = newHeaders
        .filter(header => header !== 'fName' && header !== 'lName')
        .concat('name');
    }
    if (resultTabTime) {
      newHeaders = newHeaders
        .filter(header => header !== "timeRaw")
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
