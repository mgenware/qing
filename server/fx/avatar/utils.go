package avatar

import "fmt"

func GetAvatarURL(prefix string, uid uint64, size int, avatarName string) string {
	return fmt.Sprintf("/%v/%v/%v_%v", prefix, uid, size, avatarName)
}
