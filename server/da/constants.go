/******************************************************************************************
* This code was automatically generated by go-const-gen.
* Do not edit this file manually, your changes will be overwritten.
******************************************************************************************/

/*
 * Copyright (C) The Qing Project. All rights reserved.
 *
 * Use of this source code is governed by a license that can
 * be found in the LICENSE file.
 */

 /******************************************************************************************
  * This code was automatically generated by go-const-gen.
  * Do not edit this file manually, your changes will be overwritten.
  ******************************************************************************************/


package da

// SharedConstants ...
type SharedConstants struct {
	ThreadTypeDiscussion int
	ThreadTypePost int
	ThreadTypeQuestion int
}

// Constants ...
var Constants *SharedConstants

func init() {
	Constants = &SharedConstants{
		ThreadTypeDiscussion: 3,
		ThreadTypePost: 1,
		ThreadTypeQuestion: 2,
	}
}
