/**
 * 1000 to "1,000"
 * @param {number} value 
 */
function toCommaSeperatedNumber(value)
{
    if (value.toString().length == 0)
    {
        return "0"
    }
    return parseInt(value.toString()
        .replace(/\D/g, "")).toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * "1,000" to 1000
 * @param {string} value 
 */
function fromCommaSeperatedNumber(value)
{
    return parseFloat(value.toString().replace(/,/g, ''));
}

/**
 * Quick UUID Generation
 * @returns {string}
 */
function uuidv4()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
    {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Add (1) to string if the string exists in mapped array 
 * @template T
 * @param {T[]} array 
 * @param {(x: T) => string} mapper 
 * @param {string} name 
 */
function appendRename(array, mapper, name)
{
    const names = array.map(mapper)
    while (names.some(x => x === name))
    {
        const splited = name.split(/(\(\d+\))$/gm).filter(x => x != undefined && x != "")
        if (splited.length > 1)
        {
            const front = splited.filter((x, i) => i < splited.length - 1)
            let dup = splited[splited.length - 1]
            dup = dup.replace("(", "")
            dup = dup.replace(")", "")
            const number = parseInt(dup) + 1
            name = front + `(${number})`
            continue
        }
        name = name += " (1)"
    }
    return name
}

/**
 * 
 * @param {RequestInfo} resource 
 * @param {TimeoutRequestInt} options
 * @returns 
 */
async function fetchWithTimeout(resource, options)
{
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok)
    {
        throw Error(`${resource}: ${response.status} not ok! ${await response.text()}`)
    }

    return response;
}


async function delay(timeMs)
{
    return new Promise(resolve => setTimeout(resolve, timeMs));
}
