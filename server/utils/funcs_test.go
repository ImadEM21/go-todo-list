package utils

import "testing"

type TestEmail struct {
	in  string
	out bool
}

func TestEmailValid(t *testing.T) {
	var tests = []TestEmail{
		// Valid emails
		{"email@example.com", true},
		{"firstname.lastname@example.com", true},
		{"email@subdomain.example.com", true},
		{"firstname+lastname@example.com", true},
		{"email@123.123.123.123", true},
		{"email@[123.123.123.123]", true},
		{"“email”@example.com", true},
		{"1234567890@example.com", true},
		{"email@example-one.com", true},
		{"_______@example.com", true},
		{"email@example.name", true},
		{"email@example.museum", true},
		{"email@example.co.jp", true},
		{"firstname-lastname@example.com", true},

		// Strange valid emails
		{`much.“more\ unusual”@example.com`, true},
		{"very.unusual.“@”.unusual.com@example.com", true},
		{`very.“\(),:;<>[]”.VERY.“very@\\ "very”.unusual@strange.example.com`, true},

		// Invalid emails
		{"plainaddress", false},
		{"#@%^%#$@#$@#.com", false},
		{"@example.com", false},
		{"Joe Smith <email@example.com>", false},
		{"email.example.com", false},
		{"email@example@example.com", false},
		{".email@example.com", false},
		{"email.@example.com", false},
		{"email..email@example.com", false},
		{"あいうえお@example.com", false},
		{"email@example.com (Joe Smith)", false},
		{"email@example", false},
		{"email@-example.com", false},
		{"email@example.web", false},
		{"email@111.222.333.44444", false},
		{"email@example..com", false},
		{"Abc..123@example.com", false},

		// Strange invalid emails
		{`“(),:;<>[\]@example.com`, false},
		{`just"not"right@example.com`, false},
		{`this\ is"really"not\allowed@example.com`, false},
	}
	for i, test := range tests {
		valid := ValidEmail(test.in)
		if valid != test.out {
			t.Errorf("#%d: Email(%s)=%t; attendu %t", i, test.in, valid, test.out)
		}
	}
}
