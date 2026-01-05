/*📦 Purpose:
This class (ApiFeatures) helps us search, filter, and paginate data from a MongoDB database, especially useful for APIs in an e-commerce or blog site.

🛠 What each method does:
1. search()
Searches by name if a keyword is given in the query.

Uses MongoDB’s $regex to allow case-insensitive partial matches (like searching "samosa" will find "SAMOSA", "samosas", etc.).

2. filter()
Removes fields like keyword, page, and limit from the query (since they’re used for other purposes).

Supports filtering by values like price and rating, using MongoDB operators (gt, lt, etc.).

Converts things like price[gte]=500 into { price: { $gte: 500 } }.

3. pagination(resultPerPage)
Breaks the results into pages.

Skips results from previous pages and only returns the items for the current page.

Example: If 10 results per page and you're on page 2 → it skips the first 10 results.*/

//for searching querying filtering pagination

class ApiFeatures {
  constructor(query, queryStr) {   // query is normal http query jo hum bhejenge ...queryStr is jab hum usme "keyword " add karde jaise name=samosa...postman mein we can add keywords to filter our search vahi hamara queryStr hota hai
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword, //mongodb operator
            $options: "i", //case insensitive matlab agar ABC search kiya to abc aur ABC dono dikhayaega
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter For Price and Rating

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1); //matlab agar tum page 2 pe ho to tum obviously pg1 ki products skip kardoge eg-page 1 pe hai to 10*(1-1)=0..obviously first pg pe kuch skip to hoga nahi ||ly 10*(2-1)

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
