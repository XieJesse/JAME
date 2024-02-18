import { useState } from 'react'

const ExpandableListItem = ({ pin }) => {
	const [expanded, setExpanded] = useState(false)

	const toggleExpand = () => {
		setExpanded(!expanded)
	}

	return (
		<a onClick={() => setExpanded(!expanded)}>
			<div>
				<div className="flex flex-row justify-between gap-12 mx-20 py-4">
					<div className="flex flex-row gap-12">
						<div className="eventtime"> {new Date(pin.start).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: true })} </div>
						<div className="eventtitle font-bold"> {pin.title} </div>
					</div>
					<div className="flex flex-row gap-4">
						{pin.tags.map((tag, index) => (
							<>
								{tag.checked && (
									<div className="border border-black w-fit px-4 py-2 my-2 rounded-full">
										<p>{tag.field} </p>
									</div>
								)}
							</>
						))}
					</div>
				</div>
			</div>
			<div style={{ marginLeft: '100px' }} className={expanded ? 'eventItem active' : 'eventItem'}>
				<p> {pin.host} </p>
				<p> Start: {new Date(pin.start).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: true })} </p>
				<p> End: {new Date(pin.start).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short', hour12: true })} </p>
				<p> {pin.address} </p>
				{/* <p> coordinates: {pin.coordinates} </p> */}
				<p> description: {pin.description} </p>
				<div className="flex flex-row gap-4 my-4">
					{pin.tags.map((tag, index) => (
						<>
							{tag.checked && (
								<div className="border border-black w-fit px-4 py-2 my-2 rounded-full">
									<p>{tag.field} </p>
								</div>
							)}
						</>
					))}
				</div>
			</div>
		</a>
	)
}

export default ExpandableListItem
