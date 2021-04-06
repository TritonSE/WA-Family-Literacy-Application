package controllers_test

import (
	"net/http/httptest"
	"os"
	"testing"

	"github.com/TritonSE/words-alive/internal/auth"
	"github.com/TritonSE/words-alive/internal/controllers"
	"github.com/TritonSE/words-alive/internal/database"
)

var conn = database.GetConnection()
var authenticator = auth.MockAuthenticator{}
var r = controllers.GetRouter(authenticator)
var ts = httptest.NewServer(r)

// Set up database
func TestMain(m *testing.M) {
	database.Migrate("../../migrations")

	_, _ = conn.Exec("TRUNCATE books CASCADE")
	_, _ = conn.Exec("TRUNCATE book_contents")
	_, _ = conn.Exec("TRUNCATE users")

	// Populate database
	conn.Exec("INSERT INTO books (id, title, author) values ('c_id', 'c','c1');")
	conn.Exec("INSERT INTO books (id, title, author) values ('a_id', 'a','a1');")
	conn.Exec("INSERT INTO books (id, title, author) values ('b_id', 'b','b1');")
	conn.Exec("INSERT INTO books (id, title, author) VALUES ('catcher'," +
		"'catcher in the rye', 'a');")
	conn.Exec("INSERT INTO books (id, title, author) VALUES ('update'," +
		"'update_me', 'update_me_author');")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('a_id', 'en', 'a_en_rv', 'a_en_rb', 'a_en_ev', 'a_en_eb', " +
		"'a_en_lv', 'a_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('b_id', 'en', 'b_en_rv', 'b_en_rb', 'b_en_ev', 'b_en_eb', " +
		"'b_en_lv', 'b_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('c_id', 'en', 'c_en_rv', 'c_en_rb', 'c_en_ev', 'c_en_eb', " +
		"'c_en_lv', 'c_en_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('a_id', 'es', 'a_es_rv', 'a_es_rb', 'a_es_ev', 'a_es_eb', " +
		"'a_es_lv', 'a_es_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('catcher', 'en', 'catcher_rv', 'catcher_rb', 'catcher_ev', " +
		" 'catcher_eb', 'catcher_lv', 'catcher_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('catcher', 'es', 'catcher_es_rv', 'catcher_es_rb', 'catcher_es_ev', " +
		" 'catcher_es_eb', 'catcher_es_lv', 'catcher_es_lb')")

	conn.Exec("INSERT INTO book_contents (id, lang, read_video, read_body, " +
		"explore_video, explore_body, learn_video, learn_body) VALUES " +
		"('update', 'en', 'update_en_rv', 'update_en_rb', 'update_en_ev', " +
		" 'update_en_eb', 'update_en_lv', 'update_en_lb')")

	// Close the server
	defer ts.Close()
	os.Exit(m.Run())
}
