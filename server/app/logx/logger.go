package logx

import (
	"fmt"
	"log"
	"os"
	"path"

	"github.com/fatih/color"
	"github.com/sirupsen/logrus"
)

// D is a type alias for a dictionary
type D map[string]interface{}

// Logger logs data to different files based on log levels.
type Logger struct {
	Directory string
	Console   bool

	errLog     *logrus.Logger
	warningLog *logrus.Logger
	infoLog    *logrus.Logger
}

// NewLogger creates a new logger.
func NewLogger(dir string, console bool) (*Logger, error) {
	err := os.MkdirAll(dir, os.ModePerm)
	if err != nil {
		return nil, err
	}

	logger := &Logger{Directory: dir}

	logger.infoLog = logrus.New()
	logger.warningLog = logrus.New()
	logger.errLog = logrus.New()
	err = setLoggerToFile(logger.infoLog, dir, "info.log")
	if err != nil {
		return nil, err
	}
	err = setLoggerToFile(logger.warningLog, dir, "warning.log")
	if err != nil {
		return nil, err
	}
	err = setLoggerToFile(logger.errLog, dir, "error.log")
	if err != nil {
		return nil, err
	}

	logger.Console = console
	return logger, nil
}

// LogInfo logs an info message.
func (logger *Logger) LogInfo(key string, dic D) {
	if logger.Console {
		log.Println(formatOutputStr(key, dic))
	}
	logger.infoLog.WithFields(logrus.Fields(dic)).Info(key)
}

// LogWarning logs a warning message.
func (logger *Logger) LogWarning(key string, dic D) {
	if logger.Console {
		color.Red(formatOutputStr(key, dic))
	}
	logger.warningLog.WithFields(logrus.Fields(dic)).Error(key)
}

// LogError LogError an error message.
func (logger *Logger) LogError(key string, dic D) {
	if logger.Console {
		color.Red(formatOutputStr(key, dic))
	}
	logger.errLog.WithFields(logrus.Fields(dic)).Error(key)
}

/* internal funcs */
func setLoggerToFile(logger *logrus.Logger, dir string, name string) error {
	f, err := os.OpenFile(path.Join(dir, name), os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0755)
	if err != nil {
		return err
	}
	logger.Out = f
	logger.Formatter = &logrus.JSONFormatter{}
	return nil
}

func formatOutputStr(key string, dic D) string {
	return fmt.Sprintf("%v: %v", key, dic)
}
