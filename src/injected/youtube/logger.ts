type loggable = string | Error | any
type LogType = "success" | "info" | "error"

export function log(l: loggable, logType: LogType) {
    console.log(logType, l)
    alert(logType + " " + JSON.stringify(l, null, 2));
}

export function err(l: loggable) {
    log(l, "error")
     
}