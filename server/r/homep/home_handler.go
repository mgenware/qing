package homep

import (
	"net/http"
	"qing/app"
	"qing/app/defs"
	"qing/app/handler"
	"qing/da"
	"qing/lib/validator"
	"qing/r/rcom"
	"sort"
	"strings"
)

const defaultPageSize = 10

// HomeHandler handles home page requests.
func HomeHandler(w http.ResponseWriter, r *http.Request) handler.HTML {
	resp := app.HTMLResponse(w, r)
	db := app.DB

	// Non-forums mode.
	if !app.SetupConfig().ForumsMode {
		page := validator.GetPageParamFromRequestQueryString(r)
		tab := r.FormValue(defs.Constants.KeyTab)

		var items []*da.UserThreadInterface
		var hasNext bool
		var err error

		if tab == defs.Constants.KeyPosts {
			items, hasNext, err = da.Home.SelectPosts(db, page, defaultPageSize)
		} else if tab == defs.Constants.KeyDiscussions {
			items, hasNext, err = da.Home.SelectDiscussions(db, page, defaultPageSize)
		} else if tab == defs.Constants.KeyQuestions {
			items, hasNext, err = da.Home.SelectQuestions(db, page, defaultPageSize)
		} else {
			items, hasNext, err = da.Home.SelectItems(db, page, defaultPageSize)
		}
		app.PanicIfErr(err)

		var feedListHTMLBuilder strings.Builder
		for _, item := range items {
			itemData, err := rcom.NewUserThreadData(item)
			app.PanicIfErr(err)
			feedListHTMLBuilder.WriteString(vStdThreadItem.MustExecuteToString(itemData))
		}

		pageURLFormatter := &HomePageURLFormatter{Tab: tab}
		pageData := rcom.NewPageData(page, hasNext, pageURLFormatter, 0)
		pageBarHTML := rcom.GetPageBarHTML(pageData)

		userData := NewStdPageData(pageData, feedListHTMLBuilder.String(), pageBarHTML)
		d := app.MasterPageData("", vStdPage.MustExecuteToString(resp.Lang(), userData))
		d.Scripts = app.MasterPageManager.AssetsManager.JS.HomeStd
		return resp.MustComplete(d)
	}

	// Forums mode.
	forumGroups, err := da.Home.SelectForumGroups(db)
	app.PanicIfErr(err)

	var masterHTML string
	if len(forumGroups) == 0 {
		masterHTML = rcom.VNoContentView.MustExecuteToString(nil)
	} else {
		forums, err := da.Home.SelectForums(db)
		app.PanicIfErr(err)

		// Group forums by `group_id`.
		groupMap := make(map[uint64][]*da.HomeTableSelectForumsResult)
		for _, f := range forums {
			if f.GroupID == nil {
				continue
			}
			gid := *f.GroupID
			arr := groupMap[gid]
			if arr == nil {
				arr = make([]*da.HomeTableSelectForumsResult, 0)
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
				frmHTMLBuilder.WriteString(rcom.VNoContentView.MustExecuteToString(nil))
			} else {
				var forumsHTMLBuilder strings.Builder
				for _, forum := range forums {
					forumModel := NewForumModel(forum)
					forumsHTMLBuilder.WriteString(vForumView.MustExecuteToString(forumModel))
				}

				groupModel := NewForumGroupModel(group, forumsHTMLBuilder.String())
				frmHTMLBuilder.WriteString(vForumGroupView.MustExecuteToString(groupModel))
			}
		}

		frmPageModel := NewFrmPageModel(frmHTMLBuilder.String())
		masterHTML = vFrmPage.MustExecuteToString(frmPageModel)
	}

	d := app.MasterPageData("", masterHTML)
	d.Scripts = app.MasterPageManager.AssetsManager.JS.HomeFrm
	return resp.MustComplete(d)
}
