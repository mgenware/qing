package homep

import (
	"net/http"
	"qing/a/app"
	"qing/a/appDB"
	"qing/a/appHandler"
	"qing/a/handler"
	"qing/da"
	"qing/r/rcom"
	"sort"
	"strings"
)

func renderForumPage(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := appDB.DB()
	forumGroups, err := da.ForumHome.SelectForumGroups(db)
	app.PanicOn(err)

	var mainHTML string
	if len(forumGroups) == 0 {
		mainHTML = rcom.MustRunNoContentViewTemplate()
	} else {
		forums, err := da.ForumHome.SelectForums(db)
		app.PanicOn(err)

		// Group forums by `group_id`.
		groupMap := make(map[uint64][]da.ForumHomeAGSelectForumsResult)
		for _, f := range forums {
			if f.GroupID == nil {
				continue
			}
			gid := *f.GroupID
			arr := groupMap[gid]
			if arr == nil {
				arr = make([]da.ForumHomeAGSelectForumsResult, 0)
			}
			groupMap[gid] = append(arr, f)
		}

		// Sort forums in each group.
		for _, v := range groupMap {
			sort.Slice(v, func(i, j int) bool {
				return v[i].OrderIndex < v[j].OrderIndex
			})
		}

		var frmHTMLBuilder strings.Builder
		// Iterate through forums.
		for _, group := range forumGroups {
			forums := groupMap[group.ID]
			if len(forums) == 0 {
				frmHTMLBuilder.WriteString(rcom.MustRunNoContentViewTemplate())
			} else {
				var forumsHTMLBuilder strings.Builder
				for _, forum := range forums {
					forumModel := NewForumModel(&forum)
					forumsHTMLBuilder.WriteString(vForumView.MustExecuteToString(forumModel))
				}

				groupModel := NewForumGroupModel(&group, forumsHTMLBuilder.String())
				frmHTMLBuilder.WriteString(vForumGroupView.MustExecuteToString(groupModel))
			}
		}

		frmPageModel := NewForumPageModel(frmHTMLBuilder.String())
		mainHTML = vFrmPage.MustExecuteToString(frmPageModel)
	}

	d := app.MainPageData("", mainHTML)
	d.Scripts = appHandler.MainPage().AssetManager().Script(homeFrmScript)
	return resp.MustComplete(&d)
}
