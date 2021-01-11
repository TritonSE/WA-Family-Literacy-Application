package models

type TabContent struct {
    Video  string `json:"video"?`  // youtube link
    Body   string `json:"body"`    // markdown
}

type Book struct {
    ID         string     `json:"id"`
    Title      string     `json:"title"`
    Author     string     `json:"author"`
    Image      string     `json:"image"?`       // image link
    Read       TabContent `json:"TabContent"?`
    Explore    TabContent `json:"TabContent"?`
    Learn      TabContent `json:"TabContent"?`
    Created_At string     `json:"created_at"`   // Following ISO 8601
}
