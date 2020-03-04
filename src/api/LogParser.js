/***
 * Class that is used to parse logs. 
 */
class LogParser {

    /***
     * Create a new log parser. 
     */
    constructor() {
        this.logData = undefined
    }

    /***
     * Run the data through a function based on type. For example date
     * will assume the time is a UTC epoc time. Types are
     * 
     * Date = Value will run through UTC epco time ISO function.
     * 
     * @type The type of data we are working with. 
     * @data The data to run through the function. 
     */
    getDataByType(type, data) {

        // Type might have multiple parts. 
        var typeParts = type.split('(')
        var parsedType = typeParts[0]

        // If its a date. 
        if (parsedType === 'Date') {
            var date = new Date(0)
            date.setUTCSeconds(data)
            return date.toUTCString().replace("GMT", "")
        }

        // If its a chip. 
        else if (parsedType === 'Chip') {
            return data
        }
        return data
    }

    /***
     * Parse the header information. 
     * 
     * @line The header line. 
     */
    parseHeader(line) {

        // Create the header object. 
        var headerParts = line.split(',')
        var headers = [];

        for (var j = 0; j < headerParts.length; j++) {

            // Get the column name. 
            var columnName = headerParts[j].split(':')[0]
            var dataType = headerParts[j].split(':').length == 1 ? "" : headerParts[j].split(':')[1]

            // Type might have multiple parts. 
            var typeParts = dataType.split('(')
            var parsedType = typeParts[0]

            // If we have a key value pair. 
            var extra = [];
            if (typeParts.length > 1) {

                var options = typeParts[1].replace(')', '')
                var keyValues = options.split('|')

                // Loop through types. 
                for (var x = 0; x < keyValues.length; x++) {

                    // Loop through properties. 
                    var keyValue = keyValues[x]
                    var keyValueParts = keyValue.split('-')
                    var newKeyValue = {};
                    for (var y = 0; y < keyValueParts.length; y++) {
                        newKeyValue[y + ''] = keyValueParts[y]
                    }
                    extra.push(newKeyValue)
                }
            }

            // Create the header. 
            headers.push({
                id: j,
                text: columnName,
                value: columnName.toLowerCase(),
                dataType: parsedType,
                extra: extra
            })
        }
        return headers
    }

    /***
     * Once we have the headers and items we might update items
     * based on header info. We do this for some data types such as chips. 
     * 
     * @parsed The parsed data.
     */
    postProcess(parsed) {

        var headers = parsed.headers
        var items = parsed.items

        // Loop through all the headers. 
        for (var i = 0; i < headers.length; i++) {

            // If its a chip
            if (headers[i].dataType === "Chip") {

                // Lets update all the items. 
                for (var j = 0; j < items.length; j++) {

                    // Get the item. 
                    var item = items[j]
                    for (var k = 0; k < headers[i].extra.length; k++) {
                        var extra = headers[i].extra[k]
                        if (item[headers[i].value] === extra[0 + ""]) {
                            item.color = extra[1 + ""]
                        }
                    }

                }
            }
        }

        return parsed
    }

    /***
     * Parse log data. 
     * 
     * @data Raw text data from the file. 
     */
    parseData(data) {

        // Get an array of lines from the data. 
        var lines = data.match(/[^\r\n]+/g);

        // Parse header info. 
        var headers = this.parseHeader(lines[0])

        // Loop through each line. 
        var items = []
        for (var i = 1; i < lines.length; i++) {

            // Get the tabs. 
            var tabs = lines[i].split(',');

            // Loop through headers. 
            var newItem = {}
            for (var j = 0; j < headers.length; j++) {
                newItem[headers[j].value] = this.getDataByType(headers[j].dataType, tabs[j]);
                newItem.id = i
            }
            items.push(newItem)
        }
        return this.postProcess({
            items: items,
            headers: headers
        })
    }
}

export default new LogParser()