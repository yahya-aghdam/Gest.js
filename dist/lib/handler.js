export async function fetcher(url, path = "", { method, param = undefined, headers, body }) {
    let urlParam = "";
    // arrange params if exist
    if (param != undefined) {
        urlParam = new URLSearchParams(param).toString();
    }
    const finalUrl = url + "/" + path + urlParam;
    console.log("🚀 ~ file: handler.ts:17 ~ finalUrl:", finalUrl);
    const response = await fetch(finalUrl, { method, headers, body });
    const contentType = response.headers.get("Content-Type");
    if (contentType) {
        if (contentType.includes("application/json")) {
            return response.json(); // JSON data
        }
        else if (contentType.includes("application/xml")) {
            return response.text(); // XML data
        }
        else {
            return response;
        }
    }
    else {
        throw new Error("Content-Type header not found");
    }
}
export function interfaceToURLSearchParams(data) {
    const searchParams = new URLSearchParams();
    // Define the keys to include in the URLSearchParams
    const keysToInclude = [
        "limit",
        "closed",
        "display_name",
        "user",
        "from",
        "to",
        "sort",
        "order",
    ];
    for (const key of keysToInclude) {
        const value = data[key];
        searchParams.append(key, String(value));
    }
    return searchParams;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxNQUFNLENBQUMsS0FBSyxVQUFVLE9BQU8sQ0FDM0IsR0FBVyxFQUNYLE9BQWUsRUFBRSxFQUNqQixFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUcsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQWU7SUFFekQsSUFBSSxRQUFRLEdBQVcsRUFBRSxDQUFDO0lBRTFCLDBCQUEwQjtJQUMxQixJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7UUFDdEIsUUFBUSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQ2xEO0lBRUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO0lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0NBQXNDLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDN0QsTUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBRWxFLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXpELElBQUksV0FBVyxFQUFFO1FBQ2YsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7WUFDNUMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZO1NBQ3JDO2FBQU0sSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7WUFDbEQsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXO1NBQ3BDO2FBQU07WUFDTCxPQUFPLFFBQVEsQ0FBQztTQUNqQjtLQUNGO1NBQU07UUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7S0FDbEQ7QUFDSCxDQUFDO0FBRUQsTUFBTSxVQUFVLDBCQUEwQixDQUFDLElBQWlCO0lBQzFELE1BQU0sWUFBWSxHQUFHLElBQUksZUFBZSxFQUFFLENBQUM7SUFFM0Msb0RBQW9EO0lBQ3BELE1BQU0sYUFBYSxHQUEwQjtRQUMzQyxPQUFPO1FBQ1AsUUFBUTtRQUNSLGNBQWM7UUFDZCxNQUFNO1FBQ04sTUFBTTtRQUNOLElBQUk7UUFDSixNQUFNO1FBQ04sT0FBTztLQUNSLENBQUM7SUFFRixLQUFLLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRTtRQUMvQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDekM7SUFFRCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDIn0=