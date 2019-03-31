 /******************************************************************************************
 * This code was automatically generated by mingru (https://github.com/mgenware/mingru)
 * Do not edit this file manually, your changes will be overwritten.
 ******************************************************************************************/

package da

import (
	"github.com/mgenware/go-packagex/dbx"
)

// TableTypeUserPost ...
type TableTypeUserPost struct {
}

// UserPost ...
var UserPost = &TableTypeUserPost{}

// ------------ Actions ------------

// InsertUserPost ...
func (da *TableTypeUserPost) InsertUserPost(queryable dbx.Queryable, title string, content string) (uint64, error) {
	result, err := queryable.Exec("INSERT INTO `user_post` (`title`, `content`) VALUES (?, ?)", title, content)
	return dbx.GetLastInsertIDUint64WithError(result, err)
}
