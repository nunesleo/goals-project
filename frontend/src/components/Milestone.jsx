import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag } from "@fortawesome/free-solid-svg-icons"

const Milestone = () => {
    return (
        <div title="Milestone" className="bg-white rounded-full h-8 w-8 flex items-center justify-center hover:-translate-y-0.5 hover:rotate-12 transition duration-200">
            <FontAwesomeIcon icon={faFlag} color="#F7D115" />
        </div>
    )
}

export default Milestone