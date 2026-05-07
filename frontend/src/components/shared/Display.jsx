import Popup from "./popup/Popup";
import { useState, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { timeForDisplay } from "../../utils/helpers";

const defaultHandicap = 1;

// updates data to display "last name, first name" if names present in headers
// updates data to display adjusted time for timeAdjusted header in results
function transformData({ data, tab, cats, divs }) {
  if (!data) return null;
  if (tab === 'category') { return data };
  const { id, first_name, last_name, time_raw, category_id, division_id, ...other } = data;

  let transObject = { id, ...other };

  if (first_name || last_name) {
    transObject.name = `${last_name ?? ""}, ${first_name ?? ""}`;
  }

  if (category_id) {
    transObject.category = cats.find(cat => cat.id === data.category_id).category
  }

  if (division_id) {
    transObject.division = divs.find(div => div.id === data.division_id).division
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
    { data: props.data, tab: props.tab, cats: props.categories, divs: props.divisions }),
    [props.data, props.tab, props.categories, props.divisions ]
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
        key={displayData?.id}
        className={`display-container ${props.tab}-display-grid`}
        onClick={!props.isHeader ? handlePopUp : undefined}
      >
        {updatedHeaders.map((header) => (
          <p
            key={header}
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
            key={`${props.data?.id}-${props?.categories.length}-${props?.divisions.length}`}
            setIsDisplayed={setIsDisplayed}
            data={props.data}
            tab={props.tab}
            crud={crud}
            popUpFields={props.fields}
            buttons={buttonTypes}
            setButtonTypes={setButtonTypes}
            categories={props.categories}
            divisions={props.divisions}
            setDisplayRecords={props.setDisplayRecords}
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
