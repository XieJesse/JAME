import { useState } from "react"

const ExpandableListItem = ({ pin }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <a onClick={() => setExpanded(!expanded)}>

      <div className='eventtime'> {(new Date(pin.start)).toLocaleString('en-GB', {dateStyle:"short", timeStyle:"short", hour12: true})} </div>
      <div className='eventtitle'> {pin.title} </div>
      <div className={expanded ? 'eventItem active' : 'eventItem'}>
        <p> host: {pin.host} </p>
        <p> start: {(new Date(pin.start)).toLocaleString('en-GB', {dateStyle:"short", timeStyle:"short", hour12: true})} </p>
        <p> end: {(new Date(pin.start)).toLocaleString('en-GB', {dateStyle:"short", timeStyle:"short", hour12: true})} </p>
        <p> address: {pin.address} </p>
        <p> coordinates: {pin.coordinates} </p>
        <p> description: {pin.description} </p>
        <p> tags: </p>

        {pin.tags.map((tag, index) => (
          <>
            {tag.checked &&
              <p> - {tag.field} </p>
            }
          </>
        ))}
      </div>

    </a>
  )
}

export default ExpandableListItem