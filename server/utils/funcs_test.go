package utils

import "testing"

type TestEmail struct {
	in  string
	out bool
}

type TestString struct {
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
		{"“email”@example.com", true},
		{"1234567890@example.com", true},
		{"email@example-one.com", true},
		{"_______@example.com", true},
		{"email@example.name", true},
		{"email@example.museum", true},
		{"email@example.co.jp", true},
		{"firstname-lastname@example.com", true},
		{"email@111.222.333.44444", true},
		{"あいうえお@example.com", true},
		{"email@example.com (Joe Smith)", true},
		{"email@example", true},
		{"email@-example.com", true},
		{"email@example.web", true},
		{"Joe Smith <email@example.com>", true},

		// Invalid emails
		{"plainaddress", false},
		{"#@%^%#$@#$@#.com", false},
		{"@example.com", false},
		{"email.example.com", false},
		{"email@example@example.com", false},
		{".email@example.com", false},
		{"email.@example.com", false},
		{"email..email@example.com", false},
		{"email@example..com", false},
		{"Abc..123@example.com", false},
		{"email@[123.123.123.123]", false},

		// Strange invalid emails
		{`“(),:;<>[\]@example.com`, false},
		{`just"not"right@example.com`, false},
		{`this\ is"really"not\allowed@example.com`, false},
		{`much.“more\ unusual”@example.com`, false},
		{"very.unusual.“@”.unusual.com@example.com", false},
		{`very.“\(),:;<>[]”.VERY.“very@\\ "very”.unusual@strange.example.com`, false},
	}
	for i, test := range tests {
		valid := ValidEmail(test.in)
		if valid != test.out {
			t.Errorf("#%d: Email: %s; Result: %t; expected: %t", i, test.in, valid, test.out)
		}
	}
}

func TestStringInSlice(t *testing.T) {
	var listOfStrings = []string{"abc", "cat", "dog", "kubernetes", "docker", "golang", "nodejs", "javascript"}
	var tests = []TestString{
		// Valid
		{"abc", true},
		{"cat", true},
		{"dog", true},
		{"kubernetes", true},
		{"docker", true},
		{"golang", true},
		{"nodejs", true},
		{"javascript", true},

		// Invalid
		{"cba", false},
		{"tac", false},
		{"zkefljn", false},
		{"kubernetess", false},
		{"dock", false},
		{"go", false},
		{"node", false},
		{"js", false},
		{"java", false},
	}

	for i, test := range tests {
		valid := StringInSlice(test.in, listOfStrings)
		if valid != test.out {
			t.Errorf("#%d: String: %s; Result: %t; Expected: %t", i, test.in, valid, test.out)
		}
	}
}
