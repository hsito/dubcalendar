import Notifications from "./Notifications"

/**
 * Allows notifications file to be used in other parts of application.
 * @returns div element containing notifications component
 */
function Notif() {
    return (
        <div className="Notif">
            <Notifications />
        </div>
    );
}
export default Notif