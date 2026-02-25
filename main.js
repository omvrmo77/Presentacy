const STUDENTS = [
{ username: "asha624", password: "58241", name: "Asya Hassan ", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "asis050", password: "93706", name: "Asel Ismail", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "ayta955", password: "41058", name: "Aylan Talal", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "tamo085", password: "26937", name: "Tala Mohamed", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "zesa178", password: "84513", name: "Zeina Samer ", class: "1A", role: "student", scores: { week1: 25 } },
{ username: "famo794", password: "70329", name: "Fatma Mohamed", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "lakh445", password: "19684", name: "Layan Khaled", class: "1A", role: "student", scores: { week1: 10 } },
{ username: "yaeh795", password: "52897", name: "Yasmin Ehab ", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "ahta415", password: "64072", name: "Ahmed Talal", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "khwa816", password: "64072", name: "Khaled Waleed", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "fara469", password: "87402", name: "Fayad Raed", class: "1A", role: "student", scores: { week1: 0 } },
{ username: "mamo681", password: "95268", name: "Malek Mohamed", class: "1A", role: "student", scores: { week1: 10 } },
{ username: "mome226", password: "73145", name: "Mobasher Megahed", class: "1A", role: "student", scores: { week1: 9 } },
{ username: "yaah934", password: "20489", name: "Yahia Ahmed ", class: "1A", role: "student", scores: { week1: 19 } },

{ username: "gaah897", password: "11835", name: "Gamila Ahmed", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "gamo591", password: "22764", name: "Ganna Mohamed", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "daah155", password: "33271", name: "Dana Ahmed ", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "dimo343", password: "44986", name: "Dima Mohamed", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "zael552", password: "55310", name: "Zat Elmuiz", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "rayo173", password: "66742", name: "Rana Youssef", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "famo537", password: "77193", name: "Fayrouz Mohamed", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "caho930", password: "88924", name: "Carla Hossam", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "adah501", password: "91537", name: "Adam ahmed", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "adam757", password: "24619", name: "Adam Amr", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "adna243", password: "38420", name: "Adham Nasr", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "raam530", password: "59276", name: "Rahim Amr", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "absh218", password: "61853", name: "Abdelrahman Sherif", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "moha101", password: "76401", name: "Mohamed Hasanien", class: "1B", role: "student", scores: { week1: 0 } },
{ username: "yoya069", password: "89652", name: "Younis Yasser", class: "1B", role: "student", scores: { week1: 0 } },

{ username: "famo766", password: "15853", name: "Farida mohamed ", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "haab458", password: "26616", name: "Hala Abdelmoiem", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "kamo901", password: "40650", name: "Karma Mohamed", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "kamo299", password: "29143", name: "Karma Mohamed Mostafa", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "kamo314", password: "28176", name: "Karma Mostafa", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "mama458", password: "58545", name: "Maria Mahmoud", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "rahu275", password: "59912", name: "Rawnag Hussien", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "syma940", password: "93241", name: "Syan Marwan ", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "mama395", password: "58580", name: "Malika Mahmoud", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "abse907", password: "95826", name: "Abdelrahman Seif", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "ahhu965", password: "21717", name: "Ahmed Hussien ", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "ahsh640", password: "88537", name: "Ahmed Shehab", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "maal820", password: "72722", name: "Malek Alaa", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "naad568", password: "25451", name: "Nael Adam", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "ommo139", password: "53703", name: "Omar Mohamed", class: "2A", role: "student", scores: { week1: 0 } },
{ username: "zaal888", password: "55568", name: "Zain Aldin", class: "2A", role: "student", scores: { week1: 0 } },

{ username: "ammo868", password: "95264", name: "Amira Montser", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "hawa219", password: "16655", name: "Hayat Walid ", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "mamo821", password: "68940", name: "Makka Mostafa", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "tayo423", password: "99058", name: "Tala Yousry", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "reas526", password: "16234", name: "Reman Ashraf", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "faab161", password: "50794", name: "Fahd Abdelrahman", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "hase307", password: "88575", name: "Hamza Seody", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "maam233", password: "43859", name: "Malek Amr", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "moah777", password: "14189", name: "Mohamed Ahmed ", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "moal327", password: "14599", name: "Mohamed Ali ", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "moka179", password: "95801", name: "Mohamed Karim ", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "momo741", password: "49447", name: "Mohamed Mostafa", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "momo140", password: "31236", name: "Mohamed  Moataz", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "rais904", password: "71377", name: "Rayan Islam", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "saho643", password: "28880", name: "Sajed Hossain", class: "2B", role: "student", scores: { week1: 0 } },
{ username: "sega162", password: "64323", name: "Selim Gamal", class: "2B", role: "student", scores: { week1: 0 } },

{ username: "asta019", password: "42580", name: "Aseel Tamer ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "ayah007", password: "76790", name: "Ayla Ahmed ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "bemo004", password: "64003", name: "Berla Mohamed Ahmed ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "bemo754", password: "40017", name: "Berla Mohamed Adel", class: "3", role: "student", scores: { week1: 14 } },
{ username: "goal890", password: "42841", name: "Gowan Ali ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "hoot554", password: "58144", name: "Hoor Othman ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "roah405", password: "29734", name: "Rovan Ahmed ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "kara875", password: "78436", name: "Karma Ramy ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "asmo317", password: "60778", name: "Asser Mostafa", class: "3", role: "student", scores: { week1: 0 } },
{ username: "ibab645", password: "30208", name: "Ibrahim Abdelmaboud", class: "3", role: "student", scores: { week1: 0 } },
{ username: "eyis797", password: "53872", name: "Eyad Islam", class: "3", role: "student", scores: { week1: 20 } },
{ username: "taal544", password: "25687", name: "Taim Allah", class: "3", role: "student", scores: { week1: 0 } },
{ username: "tash551", password: "62701", name: "Tamim Sherif", class: "3", role: "student", scores: { week1: 20 } },
{ username: "hamo220", password: "76116", name: "Hamza Mohamed", class: "3", role: "student", scores: { week1: 0 } },
{ username: "abmi106", password: "69796", name: "Abdallah Mina ", class: "3", role: "student", scores: { week1: 0 } },
{ username: "amah089", password: "33293", name: "Amr Ahmed", class: "3", role: "student", scores: { week1: 0 } },
{ username: "more287", password: "19211", name: "Mohamed Reda", class: "3", role: "student", scores: { week1: 0 } },

{ username: "asah790", password: "44605", name: "Asia Ahmed ", class: "4", role: "student", scores: { week1: 0 } },
{ username: "alam941", password: "27237", name: "Alma Amer", class: "4", role: "student", scores: { week1: 0 } },
{ username: "hamo217", password: "79926", name: "Hanin Montser", class: "4", role: "student", scores: { week1: 0 } },
{ username: "jaha573", password: "39992", name: "Jana Hassan", class: "4", role: "student", scores: { week1: 0 } },
{ username: "hamo230", password: "90812", name: "Hayat Mohamed", class: "4", role: "student", scores: { week1: 0 } },
{ username: "faab008", password: "13062", name: "Farah Abdelrahman", class: "4", role: "student", scores: { week1: 0 } },
{ username: "kash398", password: "41207", name: "Karma Shehab", class: "4", role: "student", scores: { week1: 0 } },
{ username: "mare951", password: "87790", name: "Malka Reda", class: "4", role: "student", scores: { week1: 0 } },
{ username: "ahma010", password: "51994", name: "Ahmed Mahmoud ", class: "4", role: "student", scores: { week1: 0 } },
{ username: "admo788", password: "77509", name: "Adam Mostafa", class: "4", role: "student", scores: { week1: 0 } },
{ username: "haah720", password: "65276", name: "Hamza Ahmed ", class: "4", role: "student", scores: { week1: 0 } },
{ username: "abmo519", password: "92483", name: "Abdallah Mohsen", class: "4", role: "student", scores: { week1: 0 } },
{ username: "omho833", password: "22486", name: "Omar hossain", class: "4", role: "student", scores: { week1: 0 } },
{ username: "slmo354", password: "19424", name: "Slim Mostafa", class: "4", role: "student", scores: { week1: 0 } },
{ username: "moah758", password: "58771", name: "Mohamed Ahmed ", class: "4", role: "student", scores: { week1: 0 } },
{ username: "moah118", password: "89107", name: "Mohamed Ahmed Ali", class: "4", role: "student", scores: { week1: 0 } },
{ username: "meos991", password: "31415", name: "Megdam Osama ", class: "4", role: "student", scores: { week1: 0 } },
{ username: "yamo666", password: "34516", name: "Yassin Mohamed", class: "4", role: "student", scores: { week1: 0 } },
{ username: "juha053", password: "63881", name: "Judy Hassan", class: "4", role: "student", scores: { week1: 0 } },

{ username: "juab889", password: "52912", name: "Judy Abdelraziq ", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "dama434", password: "70556", name: "Dan Marwan", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "raab494", password: "86718", name: "Rahma Abdelrahman", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "resh657", password: "72156", name: "Retag Sherif ", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "ceha558", password: "65582", name: "Celia Hamdy", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "faya076", password: "15431", name: "Farha Yasser", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "faah427", password: "94394", name: "Farida Ahmed ", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "kiah173", password: "74072", name: "Kinda Ahmed", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "yama079", password: "20841", name: "Yasmin Maher", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "khay498", password: "39989", name: "Khaled Ayman", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "shis237", password: "57405", name: "Shehab Islam", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "mamo913", password: "22065", name: "Malek Mohamed", class: "5A", role: "student", scores: { week1: 0 } },
{ username: "moha176", password: "54608", name: "Mohamed Hany ", class: "5A", role: "student", scores: { week1: 0 } },

{ username: "ayho984", password: "68673", name: "Ayten Hossain ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "brmo833", password: "43981", name: "Brihan Moaaz", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "tamo932", password: "27746", name: "Talia Mohamed", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "maah832", password: "76716", name: "Mariam Ahmed ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "ahha851", password: "61664", name: "Ahmed Hany", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "ahyo405", password: "33785", name: "Ahmed Yousry ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "abba495", password: "64268", name: "Abdallah Barakat", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "omah659", password: "54234", name: "Omar Ahmed ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "omma696", password: "64540", name: "Omar Mahmoud", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "samo186", password: "19580", name: "Saif Mohamed ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "moos876", password: "23162", name: "Moaaz Osama ", class: "5B", role: "student", scores: { week1: 0 } },
{ username: "yomo619", password: "47781", name: "Youssef Mosaab", class: "5B", role: "student", scores: { week1: 0 } },

{ username: "alah746", password: "92810", name: "Alma Ahmed ", class: "6", role: "student", scores: { week1: 16 } },
{ username: "jamo590", password: "89471", name: "Jana Mostafa", class: "6", role: "student", scores: { week1: 0 } },
{ username: "raah509", password: "52364", name: "Rafeef Ahmed ", class: "6", role: "student", scores: { week1: 19 } },
{ username: "zemo309", password: "92867", name: "Zeina Mohamed", class: "6", role: "student", scores: { week1: 19 } },
{ username: "maha740", password: "77410", name: "Malak Hassan ", class: "6", role: "student", scores: { week1: 0 } },
{ username: "meal470", password: "19955", name: "Mennat Allah", class: "6", role: "student", scores: { week1: 0 } },
{ username: "ibma754", password: "74741", name: "Ibrahim mahmoud", class: "6", role: "student", scores: { week1: 0 } },
{ username: "abam534", password: "78781", name: "Abdallah Amin ", class: "6", role: "student", scores: { week1: 0 } },
{ username: "moab409", password: "26555", name: "Mohamed Abelrahman", class: "6", role: "student", scores: { week1: 22 } },
{ username: "moab453", password: "36460", name: "Mostafa Abdelrahman", class: "6", role: "student", scores: { week1: 16 } },
{ username: "moos270", password: "10124", name: "Moyasser Osman", class: "6", role: "student", scores: { week1: 0 } },
{ username: "yaah791", password: "79771", name: "Yassin Ahmed ", class: "6", role: "student", scores: { week1: 25 } },
{ username: "yomo941", password: "72249", name: "Youssef Mohamed", class: "6", role: "student", scores: { week1: 17 } },
{ username: "ayab751", password: "55814", name: "Aya Abdallah", class: "6", role: "student", scores: { week1: 0 } },

{ username: "ayha058", password: "96794", name: "Aysel Hatem ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "jaah219", password: "55377", name: "Jana Ahmed ", class: "7", role: "student", scores: { week1: 20 } },
{ username: "raah033", password: "91195", name: "Rawan Ahmed ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "sita164", password: "24465", name: "Sila Tamer ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "maah123", password: "26308", name: "Mariam Ahmed ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "maha522", password: "46714", name: "Mariam Hassan ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "naab113", password: "74840", name: "Nada Abdelfatah", class: "7", role: "student", scores: { week1: 21 } },
{ username: "wama209", password: "24766", name: "Wajen mahmoud", class: "7", role: "student", scores: { week1: 0 } },
{ username: "aham406", password: "40059", name: "ahmed Amin ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "asah426", password: "48477", name: "Asser Ahmed", class: "7", role: "student", scores: { week1: 0 } },
{ username: "amhi155", password: "14314", name: "Amir Hisham", class: "7", role: "student", scores: { week1: 0 } },
{ username: "bamo871", password: "62586", name: "Badr Mohamed ", class: "7", role: "student", scores: { week1: 0 } },
{ username: "brmo769", password: "50507", name: "Braa Moaaz", class: "7", role: "student", scores: { week1: 18 } },
{ username: "hata851", password: "69543", name: "Hamza Tarek", class: "7", role: "student", scores: { week1: 25 } },
{ username: "mayo353", password: "57823", name: "Mazen Yousry", class: "7", role: "student", scores: { week1: 0 } },
{ username: "moma861", password: "23510", name: "Mostafa Maher", class: "7", role: "student", scores: { week1: 0 } },
{ username: "amya055", password: "10083", name: "Ammar Yasser", class: "7", role: "student", scores: { week1: 0 } },
{ username: "omlo576", password: "61814", name: "Omar Lotfy", class: "7", role: "student", scores: { week1: 0 } },
{ username: "yaos973", password: "94389", name: "Yassien Osama", class: "7", role: "student", scores: { week1: 0 } },
{ username: "yomo901", password: "56349", name: "Youssef Mohamed", class: "7", role: "student", scores: { week1: 0 } },
{ username: "yomo742", password: "33167", name: "Youssef Mostafa", class: "7", role: "student", scores: { week1: 0 } },

{ username: "arah495", password: "37869", name: "Arwa Ahmed ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "aseh225", password: "48328", name: "Aseel Ehab", class: "8", role: "student", scores: { week1: 0 } },
{ username: "esho278", password: "85491", name: "Esraa Hossain", class: "8", role: "student", scores: { week1: 0 } },
{ username: "roal451", password: "86181", name: "Roaa Alaa", class: "8", role: "student", scores: { week1: 0 } },
{ username: "roah875", password: "59879", name: "Roqaia Ahmed", class: "8", role: "student", scores: { week1: 20 } },
{ username: "saha469", password: "93369", name: "Salma Hany ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "saab650", password: "10384", name: "Safia Abdallah", class: "8", role: "student", scores: { week1: 0 } },
{ username: "lamo925", password: "42204", name: "Lamar Mohamed ", class: "8", role: "student", scores: { week1: 20 } },
{ username: "loos167", password: "39737", name: "Logeen Osama ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "maza362", password: "73325", name: "Maya Zaher", class: "8", role: "student", scores: { week1: 0 } },
{ username: "naah507", password: "15186", name: "Nadeen Ahmed ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "adah518", password: "50389", name: "Adam Ahmed ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "anmo798", password: "42080", name: "Anas Mohamed", class: "8", role: "student", scores: { week1: 23 } },
{ username: "haah282", password: "10906", name: "Hamza Ahmed ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "haos243", password: "29966", name: "Hamza Osama ", class: "8", role: "student", scores: { week1: 0 } },
{ username: "abba682", password: "33090", name: "Abdelrahman Barakat", class: "8", role: "student", scores: { week1: 0 } },
{ username: "ommo764", password: "73562", name: "Omar Montaser", class: "8", role: "student", scores: { week1: 0 } },
{ username: "maab032", password: "12306", name: "Mahmoud Abdelmaboud", class: "8", role: "student", scores: { week1: 0 } },
{ username: "moah392", password: "95140", name: "Mohsen Ahmed", class: "8", role: "student", scores: { week1: 0 } },
{ username: "naab530", password: "12687", name: "Nabil Abdelrahman", class: "8", role: "student", scores: { week1: 0 } },
{ username: "yohi782", password: "77616", name: "Youssef Hisham", class: "8", role: "student", scores: { week1: 0 } },

{ username: "haam491", password: "74475", name: "Hala Amin", class: "9", role: "student", scores: { week1: 0 } },
{ username: "royo539", password: "96026", name: "Rodaina Youssef ", class: "9", role: "student", scores: { week1: 20 } },
{ username: "rayo272", password: "48384", name: "Raghad Youssef ", class: "9", role: "student", scores: { week1: 26 } },
{ username: "riah994", password: "58489", name: "Rital Ahmed ", class: "9", role: "student", scores: { week1: 24 } },
{ username: "faot254", password: "52142", name: "Farah Othman ", class: "9", role: "student", scores: { week1: 25 } },
{ username: "memo408", password: "80521", name: "Menna Mohamed", class: "9", role: "student", scores: { week1: 0 } },
{ username: "asha088", password: "73484", name: "Asser Hatem", class: "9", role: "student", scores: { week1: 0 } },


      {
        name: "Omar Mohamed",
        class: "STAFF",
        username: "omohamed",
        password: "2",
        role: "teacher",
        scores: {
          week1: 0,
        }
      },
      {
        name: "Marwa Samy",
        class: "SUPERVISOR",
        username: "msamy",
        password: "1",
        role: "teacher",
        scores: {
          week1: 0,
        }
      },
        // TODO: add all your other students here in the same format
      // {
      //   name: "Khaled Walid",
      //   class: "7",
      //   scores: { week1: 20 }
      // },
      // {
      //   name: "Layan Khaled",
      //   class: "4",
      //   scores: { week1: 25 }
      // }
    ];
// ============================
//
// TODO: paste your big students array here from your old main.js.
// Change the first line from:
//   const students = [
//
// to:
//   const STUDENTS = [
//
// Make sure the array ends with ];
//
// Example shape of ONE student (your real data is longer):
//
// const STUDENTS = [
//   {
//     name: "Asya Hassan",
//     class: "1A",
//     username: "ahassan",
//     password: "58241",
//     role: "student",
//     scores: { week1: 0 }
//   },
//   ...
// ];
// ============================


// ============================
// 2. AUTH HELPERS (LOGIN DATA)
// ============================

const PRESENTACY_USER_KEY = "presentacy_current_user";

function presentacySetCurrentUser(account) {
  if (!account) return;
  const data = {
    username: (account.username || "").trim().toLowerCase(),
    name: account.name || "",
    class: account.class || "",
    role: account.role || "student"
  };
  try {
    localStorage.setItem(PRESENTACY_USER_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Could not save user", e);
  }
}

function presentacyGetCurrentUser() {
  try {
    const raw = localStorage.getItem(PRESENTACY_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Could not read user", e);
    return null;
  }
}

function applyRoleBasedNav() {
  let currentUser = null;
  try {
    currentUser =
      typeof presentacyGetCurrentUser === "function"
        ? presentacyGetCurrentUser()
        : null;
  } catch (e) {
    currentUser = null;
  }

  const teacherLink = document.querySelector('[data-nav="teacher-rubrics"]');

  if (teacherLink) {
    // Show only for teachers
    if (!currentUser || currentUser.role !== "teacher") {
      teacherLink.style.display = "none";
    } else {
      teacherLink.style.display = "";
    }
  }
}

function presentacyLogout() {
  try {
    localStorage.removeItem(PRESENTACY_USER_KEY);
  } catch (e) {
    // ignore
  }
  window.location.href = "login.html";
}

function setupLogoutButton() {
  const logoutLink = document.getElementById("logout-link");
  if (!logoutLink) return;
  logoutLink.addEventListener("click", (e) => {
    e.preventDefault();
    presentacyLogout();
  });
}

// ============================
// 3. LOGIN PAGE LOGIC
// ============================

function initPresentacyLoginPage() {
  const form = document.getElementById("login-form");
  if (!form) return;

  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const errorEl = document.getElementById("login-error");

  // Already logged in? Go to leaderboard
  const existing = presentacyGetCurrentUser();
  if (existing) {
    window.location.href = "leaderboard.html";
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = (usernameInput.value || "").trim().toLowerCase();
    const password = (passwordInput.value || "").trim();

    if (!username || !password) {
      if (errorEl) {
        errorEl.textContent = "Please fill both username and password.";
      }
      return;
    }

    if (!Array.isArray(STUDENTS)) {
      console.error("STUDENTS array is missing!");
      if (errorEl) {
        errorEl.textContent = "Internal error – tell your teacher.";
      }
      return;
    }

    // Match ignoring extra spaces in stored usernames
    const account = STUDENTS.find((s) => {
      const storedUser = (s.username || "").trim().toLowerCase();
      return storedUser === username && String(s.password) === password;
    });

    if (!account) {
      if (errorEl) {
        errorEl.textContent = "Username or password is wrong. Try again.";
      }
      return;
    }

    if (errorEl) errorEl.textContent = "";

    presentacySetCurrentUser(account);
    window.location.href = "leaderboard.html";
  });
}


// ============================
// 3.5 LOAD SCORES FROM SPREADSHEET
// ============================

// TODO: paste your real API / web-app URL here
const SCORES_API_URL = "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

/**
 * Fetch scores from the spreadsheet backend and merge into STUDENTS.
 * Expected JSON shape:
 * [
 *   { "username": "ahassan", "week1": 25, "week2": 18 },
 *   { "username": "jahmed",  "week1": 20 },
 *   ...
 * ]
 */
async function loadScoresFromAPI() {
    if (
    !SCORES_API_URL ||
    SCORES_API_URL === "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec"
  ) {
    console.warn("SCORES_API_URL is not set yet.");
    return;
  }

  if (!Array.isArray(STUDENTS)) {
    console.error("STUDENTS array is missing, cannot inject scores.");
    return;
  }

  try {
    const response = await fetch(SCORES_API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Failed to load scores from API:", response.status, response.statusText);
      return;
    }

    const rows = await response.json();

    if (!Array.isArray(rows)) {
      console.error("Scores API did not return an array:", rows);
      return;
    }

    // Build a lookup map: username -> student object
    const byUsername = new Map();
    STUDENTS.forEach((s) => {
      const key = (s.username || "").trim().toLowerCase();
      if (!key) return;
      byUsername.set(key, s);
      if (!s.scores) s.scores = {};
    });

    rows.forEach((row) => {
      if (!row) return;
      const rawUser = row.username || row.Username || row.USERNAME;
      if (!rawUser) return;

      const key = String(rawUser).trim().toLowerCase();
      const student = byUsername.get(key);
      if (!student) {
        // Username from sheet does not exist in STUDENTS
        // console.warn("No matching student for username from sheet:", key);
        return;
      }

      const destScores = student.scores || (student.scores = {});

      // Copy all numeric week values (week1, week2, week3, ...)
      Object.keys(row).forEach((field) => {
        if (/^week\d+$/i.test(field)) {
          const value = Number(row[field]);
          if (!Number.isNaN(value)) {
            destScores[field.toLowerCase()] = value;
          }
        }
      });
    });

    console.log("Scores successfully merged into STUDENTS from API.");
  } catch (err) {
    console.error("Error while loading scores from API:", err);
  }
}


// ============================
// 4. LEADERBOARD HELPERS
// ============================

// Sum of all weeks for leaderboard
function getTotalPoints(studentOrScores) {
  // This helper works with either:
  //  - a full student object that has a .scores field
  //  - OR a plain scores object with week1, week2, ...
  const scores =
    studentOrScores && studentOrScores.scores
      ? studentOrScores.scores
      : studentOrScores || {};

  return Object.values(scores).reduce(
    (sum, value) => sum + (typeof value === "number" ? value : 0),
    0
  );
}

function getBadgeForPoints(points) {
  if (points >= 85) return "Presentacy Star";
  if (points >= 55) return "Shining Star";
  if (points >= 30) return "Bright Star";
  return "Rising Star";
}

function calculateBadge(points) {
  const label = getBadgeForPoints(points);
  let text = "";

  if (points >= 85) {
    text = "You are a Presentacy Star! Keep inspiring us.";
  } else if (points >= 55) {
    text = "You are a Shining Star – wonderful work, keep going.";
  } else if (points >= 30) {
    text = "You are a Bright Star. Practice will make you even stronger.";
  } else if (points > 0) {
    text = "You are a Rising Star. Every presentation helps you grow.";
  } else {
    text = "Your badge will appear after your first score.";
  }

  return { label, text };
}

// Build the leaderboard table (top 5) for whole school or for a class
function renderLeaderboardTable(classFilter) {
  const tbody = document.getElementById("leaderboard-table-body");
  if (!tbody || !Array.isArray(STUDENTS)) return;

  let pool =
    classFilter && classFilter !== ""
      ? STUDENTS.filter((s) => s.class === classFilter)
      : STUDENTS.slice();

  // Remove non-students (teachers)
  pool = pool.filter((s) => s.role !== "teacher");

  const withTotals = pool.map((s) => ({
    ...s,
    totalPoints: getTotalPoints(s)
  }));

  const nonZero = withTotals.filter((s) => s.totalPoints > 0);

  nonZero.sort((a, b) => b.totalPoints - a.totalPoints);

  const top = nonZero.slice(0, 5);

  tbody.innerHTML = top
    .map((student, index) => {
      const rank = index + 1;
      const rankClass =
        rank === 1
          ? "rank rank-1"
          : rank === 2
          ? "rank rank-2"
          : rank === 3
          ? "rank rank-3"
          : "rank";
      const badge = getBadgeForPoints(student.totalPoints);

      return `
        <tr>
          <td class="${rankClass}">${rank}</td>
          <td>${student.name}</td>
          <td>${student.class}</td>
          <td>${student.totalPoints}</td>
          <td><span class="badge">${badge}</span></td>
        </tr>
      `;
    })
    .join("");

  if (top.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="font-size:0.85rem; color:var(--text-muted); padding:0.75rem;">
          No scores yet. The leaderboard will appear after the first presentations.
        </td>
      </tr>
    `;
  }
}

function getMotivationText(scoreWeek1) {
  const score = typeof scoreWeek1 === "number" ? scoreWeek1 : 0;

  if (score >= 28) {
    return "Amazing start! Keep this level and try to challenge yourself with harder topics.";
  } else if (score >= 20) {
    return "Great work. You have a solid base—focus on one skill (like eye contact or voice) to level up.";
  } else if (score > 0) {
    return "You’ve started the journey. Every presentation is practice—keep going and you will feel the difference.";
  } else {
    return "Your first score will appear here after your first presentation. Get ready to show us what you can do!";
  }
}

function renderStudentResultCard(student, targetEl) {
  if (!targetEl) return;

  if (!student) {
    targetEl.innerHTML = `
      <p class="student-message">
        No matching student was found. Please check the name and class.
      </p>
    `;
    return;
  }

  const scores = student.scores || {};
  const weekEntries = Object.entries(scores);

  weekEntries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  let weeksHtml = "";

  if (weekEntries.length === 0) {
    weeksHtml = "<p>No scores recorded yet.</p>";
  } else {
    weeksHtml = weekEntries
      .map(([weekKey, score]) => {
        const weekNumber = weekKey.replace("week", "");
        return `<p>Week ${weekNumber}: <strong>${score}</strong> points</p>`;
      })
      .join("");
  }

  const week1Score = scores.week1 || 0;
  const motivation = getMotivationText(week1Score);

  targetEl.innerHTML = `
    <div class="student-result-card">
      <h3>${student.name}</h3>
      <div class="student-meta">
        Class: ${student.class}
      </div>
      <div class="student-weeks">
        ${weeksHtml}
      </div>
      <p class="motivation">${motivation}</p>
    </div>
  `;
}

function renderMultipleResults(list, term, selectedClassLabel, targetEl) {
  if (!targetEl) return;

  const cards = list
    .map(
      (student) => `
      <div class="student-result-card">
        <h3>${student.name}</h3>
        <div class="student-meta">
          Class: ${student.class}
        </div>
        <div class="student-weeks">
          ${
            student.scores && typeof student.scores.week1 === "number"
              ? `<p>Week 1: <strong>${student.scores.week1}</strong> points</p>`
              : "<p>No scores recorded yet.</p>"
          }
        </div>
      </div>
    `
    )
    .join("");

  const classInfo =
    selectedClassLabel && selectedClassLabel !== ""
      ? ` in class <strong>${selectedClassLabel}</strong>`
      : "";

  targetEl.innerHTML = `
    <div style="margin-bottom:0.4rem; font-size:0.85rem; color:var(--text-muted);">
      We found ${list.length} students matching "<strong>${term}</strong>"${classInfo}. 
      Add more letters (for example last name) if this is not you.
    </div>
    <div class="student-multi-results">
      ${cards}
    </div>
  `;
}

function renderNotFound(term, selectedClassLabel, targetEl) {
  if (!targetEl) return;
  const classInfo =
    selectedClassLabel && selectedClassLabel !== ""
      ? ` in class "<strong>${selectedClassLabel}</strong>"`
      : "";

  targetEl.innerHTML = `
    <div class="error-message">
      No student found with the name "<strong>${term}</strong>"${classInfo}. 
      Check your spelling or try your full name.
    </div>
  `;
}

// ============================
// 5. LEADERBOARD SEARCH MODES
// ============================

function setupTeacherSearchOnLeaderboard() {
  const classFilter = document.getElementById("class-filter");
  const nameInput = document.getElementById("student-search-input");
  const searchBtn = document.getElementById("student-search-button");
  const resultEl = document.getElementById("student-result");

  if (!classFilter || !nameInput || !searchBtn || !resultEl) return;

  classFilter.disabled = false;
  nameInput.disabled = false;
  searchBtn.disabled = false;
  searchBtn.textContent = "Search";

  searchBtn.addEventListener("click", () => {
    const selectedClass = classFilter.value.trim();
    const term = nameInput.value.trim();
    if (!term) {
      resultEl.innerHTML =
        '<p class="student-message">Please type a name to search.</p>';
      return;
    }

    const lowerTerm = term.toLowerCase();

    let pool = STUDENTS.filter((s) => s.role === "student");
    if (selectedClass) {
      pool = pool.filter((s) => s.class === selectedClass);
    }

    if (pool.length === 0) {
      renderNotFound(term, selectedClass, resultEl);
      return;
    }

    const exact = pool.find(
      (s) => s.name.toLowerCase() === lowerTerm
    );
    if (exact) {
      renderStudentResultCard(exact, resultEl);
      return;
    }

    const startsWith = pool.filter((s) => {
      const n = s.name.toLowerCase();
      return n === lowerTerm || n.startsWith(lowerTerm + " ");
    });

    if (startsWith.length === 1) {
      renderStudentResultCard(startsWith[0], resultEl);
      return;
    } else if (startsWith.length > 1) {
      renderMultipleResults(startsWith, term, selectedClass, resultEl);
      return;
    }

    const broad = pool.filter((s) =>
      s.name.toLowerCase().includes(lowerTerm)
    );

    if (broad.length === 1) {
      renderStudentResultCard(broad[0], resultEl);
    } else if (broad.length > 1) {
      renderMultipleResults(broad, term, selectedClass, resultEl);
    } else {
      renderNotFound(term, selectedClass, resultEl);
    }
  });
}

function setupStudentViewOnLeaderboard(currentUser) {
  const searchSection = document.getElementById("student-search");
  const resultEl = document.getElementById("student-result");

  if (!searchSection || !resultEl) return;

  const titleEl = searchSection.querySelector("h1");
  const infoPara = searchSection.querySelector("p");
  const searchRow = searchSection.querySelector(".search-row");

  // 1) Hide the whole search row (class, name, button)
  if (searchRow) {
    searchRow.style.display = "none";
  }

  // 2) Change the title & text to talk to this student
  if (titleEl) {
    titleEl.textContent = "Your Presentacy Score";
  }

  if (infoPara) {
    infoPara.textContent = `This card shows your score for each week, ${currentUser.name}.`;
  }

  // 3) Find this student in the data
  const me = STUDENTS.find(
    (s) =>
      (s.username || "").trim().toLowerCase() ===
      (currentUser.username || "").trim().toLowerCase()
  );

  if (!me) {
    resultEl.innerHTML = `
      <p class="student-message">
        You are logged in as <strong>${currentUser.name}</strong>,
        but we couldn’t find your data. Please tell your teacher.
      </p>
    `;
    return;
  }

  // 4) Show a small friendly line + their score card
  resultEl.innerHTML = `
    <p class="student-message">
      Hi <strong>${me.name}</strong> (${me.class}) 👋  
      Here is your Presentacy score for each week:
    </p>
  `;
  renderStudentResultCard(me, resultEl);
}

function setupAnonymousViewOnLeaderboard() {
  const classFilter = document.getElementById("class-filter");
  const nameInput = document.getElementById("student-search-input");
  const searchBtn = document.getElementById("student-search-button");
  const resultEl = document.getElementById("student-result");

  if (!resultEl) return;

  if (classFilter) classFilter.disabled = true;
  if (nameInput) {
    nameInput.disabled = true;
    nameInput.placeholder = "Log in to see your own score.";
  }
  if (searchBtn) {
    searchBtn.disabled = true;
    searchBtn.textContent = "Login required";
  }

  resultEl.innerHTML = `
    <p class="student-message">
      Please log in on this device if you want to see your own score.
    </p>
  `;
}

function initLeaderboardPage() {
  const leaderboardBody = document.getElementById("leaderboard-table-body");
  const leaderboardClassFilter = document.getElementById("leaderboard-class-filter");

  if (!leaderboardBody) return;

  // Initial render: all classes
  renderLeaderboardTable("");

  // Filter by class
  if (leaderboardClassFilter) {
    leaderboardClassFilter.addEventListener("change", () => {
      const selectedClass = leaderboardClassFilter.value || "";
      renderLeaderboardTable(selectedClass);
    });
  }
}

// ============================
// 5.5 MY SCORES PAGE (student view with rubrics)
// ============================
const RUBRICS_API_URL = "https://script.google.com/macros/s/AKfycbxI1jxJqH44LkFiF6LESE3TUSTJei8JYyPPZYvBZfJgnv5dYW-aco0UZR-_uXr1cTk-/exec";

// ============================
// 6. NAVBAR + HOME + GENERATOR + WALL
// ============================

function setupNavHighlight() {
  const currentPage = document.body.dataset.page;
  const links = document.querySelectorAll("[data-page-link]");
  links.forEach((link) => {
    if (link.dataset.pageLink === currentPage) {
      link.classList.add("nav-link--active");
    }
  });
}

let mobileNavInitialized = false;

function setupMobileNav() {
  if (mobileNavInitialized) return; // prevent adding the listener twice
  mobileNavInitialized = true;

  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("nav-links--open");
  });
}

function renderUserGreeting() {
  const greetingEl = document.getElementById("user-greeting");
  if (!greetingEl) return;

  const user = presentacyGetCurrentUser();
  if (!user) {
    greetingEl.textContent = "";
    return;
  }

  const fullName = user.name || "";
  const firstName = fullName.split(" ")[0] || fullName;

  const hour = new Date().getHours();
  let prefix = "Welcome";
  if (hour < 12) {
    prefix = "Good morning";
  } else if (hour < 18) {
    prefix = "Good afternoon";
  } else {
    prefix = "Good evening";
  }

  greetingEl.textContent = `${prefix}, ${firstName}!`;
}

function initHomePage() {
  const quoteEl = document.getElementById("presentacy-quote");
  const challengeEl = document.getElementById("presentacy-challenge");

  if (!quoteEl || !challengeEl) return;

  const quotes = [
    "Every time you speak, you get 1% better.",
    "Your voice matters more than your mistakes.",
    "Confidence is just practice wearing a costume.",
    "The audience wants you to win, not fail.",
    "A strong start is good, but a clear ending is magic.",
    "If you’re nervous, that means you care. Use it.",
    "Fluency grows when you keep talking, not when you’re perfect."
  ];

  const challenges = [
    "In your next presentation, try to look at three different people in the room.",
    "Choose one key word and say it a little slower and stronger than the others.",
    "Start your next talk with a question instead of “Today I will talk about…”.",
    "Use one new word from your vocabulary notebook in your next presentation.",
    "Try not to read for 10 seconds: just look up and speak from your head.",
    "Add one short personal story to your next presentation.",
    "End your next talk with one clear sentence that starts with “So in the end…”."
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomChallenge =
    challenges[Math.floor(Math.random() * challenges.length)];

  quoteEl.textContent = randomQuote;
  challengeEl.textContent = randomChallenge;
}

function initGeneratorPage() {
  const topicButton = document.getElementById("topic-button");
  const topicLikeButton = document.getElementById("topic-like-button");
  const topicOutput = document.getElementById("topic-output");
  const topicIdeas = document.getElementById("topic-ideas");

  if (!topicButton || !topicOutput) return;

  // ========= 1. WHO IS THE STUDENT? =========
  const currentUser =
    (typeof presentacyGetCurrentUser === "function" &&
      presentacyGetCurrentUser()) ||
    null;

  let firstName = "";
  if (currentUser) {
    if (typeof getFirstName === "function") {
      firstName = getFirstName(currentUser.name || currentUser.username);
    } else {
      firstName = (currentUser.name || currentUser.username || "")
        .split(" ")[0];
    }
  }

  function getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  // Initial message
  if (firstName) {
    topicOutput.textContent =
      'Hi ' +
      firstName +
      '! Press "Give me another topic" to get started.';
  } else {
    topicOutput.textContent =
      'Press "Give me another topic" to get your first topic.';
  }

  // ========= 2. TOPICS LIST (more interesting ones) =========
  const topics = [
    // Cars & tech
    "My dream car",
    "Electric cars vs petrol cars",
    "A cool invention that changed our lives",
    "If I could design a new app",

    // Games & media
    "My favourite video game",
    "A movie or series I can't forget",
    "My favourite YouTuber or content creator",
    "The power of music in my life",

    // Sports
    "My favourite football team",
    "A sports player I admire",
    "Team sports vs individual sports",

    // Daily life & opinions
    "Fast food: good or bad?",
    "Should homework be banned?",
    "Social media: helpful or harmful?",
    "Being kind online",

    // People & relationships
    "What makes a good friend",
    "A time when I helped someone",
    "Why teamwork is important",

    // Animals & nature
    "Pets vs wild animals",
    "The most interesting animal in the world",
    "A place in nature I would love to visit",

    // Future & imagination
    "Living on Mars in the future",
    "Robots in our lives",
    "If I could meet any famous person",
    "If I could travel to the future",

    // School & self
    "One rule I would add to our school",
    "A hobby that makes me feel calm",
    "Something I learned from a mistake",
    "One small change that could improve our classroom"
  ];

  let currentTopic = "";

  function clearTopicIdeas() {
    if (!topicIdeas) return;
    topicIdeas.innerHTML = "";
    topicIdeas.classList.remove("topic-ideas--visible");
  }

  function pickRandomTopic() {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    currentTopic = randomTopic;
    clearTopicIdeas();

    if (firstName) {
      const greeting = getTimeGreeting();
      topicOutput.textContent =
        greeting + ', ' + firstName + '! How about you talk about "' + randomTopic + '"?';
    } else {
      topicOutput.textContent = randomTopic;
    }
  }

  // ========= 3. PRESENTATION STRUCTURE (what you already liked) =========
  function getPresentationGuide(topic) {
    const lower = topic.toLowerCase();

    // Hobby
    if (lower.includes("hobby")) {
      return {
        category: "Favourite hobby",
        hook: [
          "Guess what I love doing in my free time…",
          "When I have some free time, there is one thing I always want to do."
        ],
        structure: [
          "Say the name of the hobby and how you discovered it.",
          "Explain where/when you do it and if you do it alone or with others.",
          "Describe what you actually do, step by step.",
          "Explain how it makes you feel and why it is important to you."
        ],
        ideas: [
          "Who taught you this hobby or how you learned it.",
          "A funny or special memory connected to this hobby.",
          "What you need (equipment, place, people).",
          "How this hobby could help your future or your skills."
        ],
        phrases: [
          "In my free time, I really enjoy…",
          "I started this hobby when…",
          "One thing I love about it is…",
          "That’s why this hobby is a big part of my life."
        ]
      };
    }

    // School / classroom
    if (
      lower.includes("school") ||
      lower.includes("classroom") ||
      lower.includes("rule")
    ) {
      return {
        category: "School life",
        hook: [
          "Let me take you on a tour of my school day.",
          "School is more than just lessons and homework for me."
        ],
        structure: [
          "Introduce your school and which grade you are in.",
          "Describe a normal day: morning, lessons, breaks.",
          "Talk about one subject, activity or teacher you really like.",
          "Mention one thing you would improve and why."
        ],
        ideas: [
          "Describe the atmosphere in your class (quiet, noisy, friendly…).",
          "Talk about a special event at school (trip, show, project).",
          "Explain how school helps you build your future.",
          "Say how you feel at the end of a school day."
        ],
        phrases: [
          "A typical day at my school starts when…",
          "One of my favourite things about my school is…",
          "If I could change one thing, it would be…",
          "School is important to me because…"
        ]
      };
    }

    // Travel / place / Mars
    if (
      lower.includes("place") ||
      lower.includes("visit") ||
      lower.includes("travel") ||
      lower.includes("mars") ||
      lower.includes("future")
    ) {
      return {
        category: "Travel & places",
        hook: [
          "Close your eyes and imagine you are with me in this place.",
          "There is one place I will never forget."
        ],
        structure: [
          "Say where the place is and when you visited (or want to visit).",
          "Describe what you saw, heard, smelt or tasted.",
          "Explain who you were with and what you did together.",
          "Tell why this place is special for you."
        ],
        ideas: [
          "Describe the weather, colours and sounds around you.",
          "A small story that happened during the trip.",
          "How you felt when you arrived and when you left.",
          "Would you recommend this place to others? Why?"
        ],
        phrases: [
          "I still remember the moment when…",
          "One thing that surprised me was…",
          "If you ever go there, you should definitely…",
          "That’s why this place is unforgettable for me."
        ]
      };
    }

    // Friends / teamwork
    if (lower.includes("friend") || lower.includes("team")) {
      return {
        category: "Friends & teamwork",
        hook: [
          "We all need people around us – let me tell you about mine.",
          "I understood the real meaning of friendship when…"
        ],
        structure: [
          "Give your own definition of a good friend or good team.",
          "Introduce one friend or one team you are part of.",
          "Tell a short story where this friend/team helped you or needed you.",
          "Explain what you learned from this experience."
        ],
        ideas: [
          "How you met this friend / joined this team.",
          "What makes this friend or team special (kind, funny, honest…).",
          "How you solve problems or conflicts together.",
          "Why friendship or teamwork is important in life."
        ],
        phrases: [
          "For me, a real friend is someone who…",
          "We worked together and…",
          "This showed me that…",
          "That’s why I am grateful for my friends / my team."
        ]
      };
    }

    // Life lessons / helping / mistakes
    if (
      lower.includes("helped") ||
      lower.includes("mistake") ||
      lower.includes("learned") ||
      lower.includes("time when")
    ) {
      return {
        category: "Life lessons",
        hook: [
          "There is one moment in my life that taught me something important.",
          "Let me tell you a short story that changed me."
        ],
        structure: [
          "Set the scene: when and where did it happen?",
          "Introduce the people who were there.",
          "Explain what happened step by step.",
          "Say what you learned from this moment."
        ],
        ideas: [
          "How you felt during the situation.",
          "What you would do differently now.",
          "How this lesson helps you today.",
          "Why this memory stayed in your mind."
        ],
        phrases: [
          "At first, I thought that…",
          "Then something unexpected happened…",
          "In the end, I realised that…",
          "Since that day, I always remember…"
        ]
      };
    }

    // Sports
    if (
      lower.includes("football") ||
      lower.includes("player") ||
      lower.includes("sport")
    ) {
      return {
        category: "Sports",
        hook: [
          "Sport is a big part of my life.",
          "Let me tell you about the sport that I really enjoy."
        ],
        structure: [
          "Introduce the sport or team and how you discovered it.",
          "Explain the basic rules in a simple way.",
          "Talk about your favourite team / player / match.",
          "Say why this sport is special for you."
        ],
        ideas: [
          "A special match or goal you remember.",
          "How sport teaches teamwork and discipline.",
          "How often you play or watch it.",
          "How sport helps your health or your mood."
        ],
        phrases: [
          "One match I will never forget is…",
          "What I admire about this player is…",
          "When I watch this sport, I feel…",
          "That’s why this sport is important to me."
        ]
      };
    }

    // Tech, games, social media, robots, apps
    if (
      lower.includes("video game") ||
      lower.includes("game") ||
      lower.includes("social media") ||
      lower.includes("app") ||
      lower.includes("robot")
    ) {
      return {
        category: "Technology & media",
        hook: [
          "Technology is everywhere in our lives.",
          "There is one app / game / website I use a lot."
        ],
        structure: [
          "Introduce the app / game / technology.",
          "Explain what you use it for and how it works in simple words.",
          "Talk about why you like it or what is dangerous about it.",
          "Give your opinion: is it good, bad, or depends on how we use it?"
        ],
        ideas: [
          "Screen time and how many hours per day is healthy.",
          "Online safety and being kind on the internet.",
          "How this technology makes life easier or harder.",
          "What the future with this technology might look like."
        ],
        phrases: [
          "One reason I like it is…",
          "However, there is also a problem:",
          "If we use it in a smart way, we can…",
          "In my opinion, the most important thing is…"
        ]
      };
    }

    // Food, fast food, health
    if (lower.includes("food")) {
      return {
        category: "Food & health",
        hook: [
          "We all eat every day, but today I want to talk about one type of food.",
          "There is one kind of food many people love, but it can be a problem too."
        ],
        structure: [
          "Introduce the type of food (fast food, traditional food, a dish).",
          "Explain why people like it so much.",
          "Talk about the good and bad effects on our health.",
          "Give your opinion and maybe a suggestion."
        ],
        ideas: [
          "Examples of fast food and what they contain.",
          "Difference between eating it sometimes and every day.",
          "Better choices you can make when you eat out.",
          "A healthy version of this food you could try."
        ],
        phrases: [
          "On the one hand,…",
          "On the other hand,…",
          "A simple change we can make is…",
          "I think balance is the key because…"
        ]
      };
    }

    // Default guide
    return {
      category: "Any topic",
      hook: [
        "Let me share my ideas about this topic.",
        "I chose this topic because it is close to my heart."
      ],
      structure: [
        "Start with one clear opening sentence that introduces the topic.",
        "Give 2–3 main ideas or reasons in the middle.",
        "Use an example or short story to make it real.",
        "Finish with one strong sentence that repeats your main message."
      ],
      ideas: [
        "Think of one real situation from your life connected to the topic.",
        "Explain your opinion and also the opposite opinion.",
        "Use connecting words: first, also, however, finally.",
        "Add feelings: how does this topic make you feel?"
      ],
      phrases: [
        "First of all, I believe…",
        "Another important point is…",
        "For example,…",
        "To sum up, I think…"
      ]
    };
  }

  // ========= 4. TOPIC CONTENT (facts & sub-ideas) =========
  function getTopicContentIdeas(topic) {
    const lower = topic.toLowerCase();

    // Cars
    if (lower.includes("car")) {
      return {
        title: "Ideas about cars",
        intro:
          "Here are some concrete things you can talk about if your topic is cars:",
        bullets: [
          "Different types of cars: small city cars, family cars, sports cars, electric cars, SUVs.",
          "What engines do: they turn fuel (or electricity) into movement. You can mention petrol, diesel, hybrid and electric engines.",
          "Basic parts: engine, wheels, brakes, seats, seat belts, air bags, lights – choose 2–3 to describe.",
          "Safety and rules: wearing a seat belt, speed limits, traffic lights, driving tests.",
          "Famous brands or models you like and why (for example: fast, safe, comfortable, eco-friendly).",
          "Future of cars: self-driving cars, cars that use only electricity, or cars that can park themselves."
        ],
        extra:
          "You can pick ONE car you like and describe its look, speed, colour, and why it is your dream car."
      };
    }

    // Video games
    if (lower.includes("video game") || lower.includes("game")) {
      return {
        title: "Ideas about video games",
        intro:
          "If you talk about video games, try to choose one game or one type of game:",
        bullets: [
          "Name of the game, the company (if you know it) and what kind of game it is (adventure, sport, racing, puzzle, etc.).",
          "Basic story or goal: what do you have to do to win?",
          "What skills the game uses: strategy, quick reactions, teamwork, creativity.",
          "Positive sides: fun, relaxing, learning English, meeting friends online.",
          "Negative sides: too much screen time, addiction, violent content, less sleep or less exercise.",
          "Your own rules for yourself: how many hours you think is healthy and how you try to control it."
        ],
        extra:
          "You can compare two games you know and say which one you recommend and why."
      };
    }

    // Football / sports
    if (
      lower.includes("football") ||
      lower.includes("player") ||
      lower.includes("team")
    ) {
      return {
        title: "Ideas about football and sports",
        intro:
          "You can focus on one team, one player, or sport in general:",
        bullets: [
          "Name of the team / player and which country or club they play for.",
          "Basic rules of the sport in simple words (how to score, how many players, time of the match).",
          "A famous match or moment you remember and what happened.",
          "Qualities of a good player: fitness, teamwork, discipline, attitude.",
          "Why people around the world love this sport (emotion, community, national pride).",
          "How sport can help with health, confidence and stress."
        ],
        extra:
          "Tell a short story about a time you played this sport and how you felt before and after the game."
      };
    }

    // Social media
    if (lower.includes("social media")) {
      return {
        title: "Ideas about social media",
        intro:
          "You can choose one platform (Instagram, TikTok, etc.) or talk about social media in general:",
        bullets: [
          "What people do on social media: sharing photos, making videos, chatting, following news.",
          "Good sides: staying in touch with friends and family, learning new things, finding inspiration.",
          "Problems: fake news, online bullying, comparing yourself to others, wasting time.",
          "How algorithms work in simple words: they show you more of what you already like.",
          "Rules you think are important for safe and kind use (age limits, privacy, blocking people).",
          "Your personal experience: a positive or negative moment you had online."
        ],
        extra:
          "You can end by giving your own three rules for healthy social media use."
      };
    }

    // Apps / technology / robots
    if (lower.includes("app") || lower.includes("robot")) {
      return {
        title: "Ideas about apps and robots",
        intro:
          "Choose one app or one type of robot and explain how it changes our life:",
        bullets: [
          "What the app/robot does and who uses it (students, doctors, drivers, etc.).",
          "Everyday examples: maps apps, delivery apps, translation apps, cleaning robots.",
          "Benefits: saving time, helping with difficult or dangerous work, giving information.",
          "Risks: people becoming too lazy, less face-to-face communication, job changes.",
          "Future ideas: what kind of app or robot you would like to invent.",
          "One real situation where an app or robot helped you in your day."
        ],
        extra:
          "Describe one day in the future where robots and apps help you from morning to night."
      };
    }

    // Fast food / food
    if (lower.includes("fast food") || lower.includes("food")) {
      return {
        title: "Ideas about food and fast food",
        intro:
          "Think of one type of fast food or one special dish you like:",
        bullets: [
          "What it looks like, tastes like and smells like.",
          "Why people love it (quick, cheap, tasty, everywhere).",
          "Ingredients: fat, salt, sugar, vegetables, meat, bread.",
          "Health effects of eating it very often vs sometimes.",
          "Healthier choices you can make when you order food.",
          "Traditional food from your culture you are proud of and why."
        ],
        extra:
          "Compare fast food with a homemade meal from your family and explain which you prefer and why."
      };
    }

    // Pets / animals
    if (lower.includes("pet") || lower.includes("animal")) {
      return {
        title: "Ideas about pets and animals",
        intro:
          "Choose one animal or compare pets with wild animals:",
        bullets: [
          "Basic facts: where it lives, what it eats, how long it lives.",
          "Special abilities: speed, night vision, strong smell, camouflage.",
          "How people use or help this animal (police dogs, guide dogs, farm animals, rescue animals).",
          "Why having a pet can be good (company, responsibility, friendship).",
          "Problems: animals in small cages, pollution, disappearing habitats.",
          "One personal story with an animal in your life."
        ],
        extra:
          "Imagine you are this animal for one day and describe what you see and do."
      };
    }

    // Music
    if (lower.includes("music")) {
      return {
        title: "Ideas about music",
        intro:
          "You can choose one song, one artist, or music in general:",
        bullets: [
          "What kind of music you enjoy (pop, rap, classical, traditional, etc.).",
          "How music changes your mood (happy, calm, excited, motivated).",
          "Times when you listen to music: studying, walking, cleaning, travelling.",
          "Why some lyrics are meaningful or important to you (without saying the exact lyrics).",
          "Differences between live concerts and listening with headphones.",
          "How music connects people from different countries and cultures."
        ],
        extra:
          "Describe a moment when a song helped you or stayed in your mind for a long time."
      };
    }

    // Movies / series
    if (
      lower.includes("movie") ||
      lower.includes("series") ||
      lower.includes("film")
    ) {
      return {
        title: "Ideas about movies and series",
        intro:
          "Pick ONE movie or series you really like so you can be detailed:",
        bullets: [
          "The name, genre (comedy, drama, action, etc.) and main characters.",
          "The setting: where and when the story happens.",
          "The main problem or question in the story (without full spoilers).",
          "What you learned or felt from the story.",
          "Why you recommend it (or why you don’t recommend it).",
          "How it is different from other movies or series you know."
        ],
        extra:
          "Imagine there is a part two of this movie/series and explain what you think should happen next."
      };
    }

    // YouTubers / content creators
    if (
      lower.includes("youtuber") ||
      lower.includes("content creator")
    ) {
      return {
        title: "Ideas about YouTubers and content creators",
        intro:
          "Choose one creator and explain why you follow them:",
        bullets: [
          "What type of videos they make (gaming, education, comedy, lifestyle, etc.).",
          "How often they post and how long their videos are.",
          "What you like about their personality or style.",
          "Positive things: learning, entertainment, inspiration.",
          "Possible problems: copying dangerous challenges, unrealistic life, too many ads.",
          "Your own advice on how to follow creators in a smart way."
        ],
        extra:
          "If you could collaborate with this creator, describe the video you would make together."
      };
    }

    // Homework / school rules
    if (lower.includes("homework")) {
      return {
        title: "Ideas about homework",
        intro:
          "You can talk about both good and bad sides of homework:",
        bullets: [
          "What homework is supposed to do: practice, revision, responsibility.",
          "Problems: too much homework, stress, no time for rest or hobbies.",
          "Examples of useful homework you had and useless homework you had.",
          "How homework could be improved (projects, group work, creative tasks).",
          "Difference between homework in primary and secondary.",
          "Your ideal amount of homework during a normal week."
        ],
        extra:
          "End with a short 'homework rule' you would make for all schools."
      };
    }

    // Mars / space
    if (lower.includes("mars") || lower.includes("space")) {
      return {
        title: "Ideas about space and Mars",
        intro:
          "Imagine life beyond Earth and talk about what it would be like:",
        bullets: [
          "Why people are interested in exploring space and other planets.",
          "Difficulties of living on Mars: air, water, temperature, distance.",
          "What a house or city on Mars might look like.",
          "Jobs people might have there (scientist, engineer, farmer, doctor).",
          "How living on another planet would change daily life (food, school, free time).",
          "Whether you would like to live there or just visit, and why."
        ],
        extra:
          "Describe one day of your life as a student on Mars, from morning to night."
      };
    }

    // Default content ideas
    return {
      title: "Ideas about this topic",
      intro:
        "Here are some simple things you can talk about to make your topic richer:",
      bullets: [
        "Give a short definition or explanation of the topic in your own words.",
        "Give 2–3 real examples from your life or things you have seen.",
        "Say why this topic is important for you or for other people.",
        "Mention one problem connected to this topic and one possible solution."
      ],
      extra:
        "Try to add at least one small story or real situation. Stories make every topic more interesting."
    };
  }

  // ========= 5. RENDER EVERYTHING IN THE CARD =========
  function renderTopicGuide(topic) {
    if (!topicIdeas) return;

    const guide = getPresentationGuide(topic);
    const content = getTopicContentIdeas(topic);

    const hookList = guide.hook.map((h) => "<li>" + h + "</li>").join("");
    const structureList = guide.structure
      .map((s) => "<li>" + s + "</li>")
      .join("");
    const ideasList = guide.ideas.map((i) => "<li>" + i + "</li>").join("");
    const contentList = content.bullets
      .map((b) => "<li>" + b + "</li>")
      .join("");
    const phrases = guide.phrases.join(" · ");

    topicIdeas.innerHTML =
      '<div class="topic-ideas-card">' +
      '<h2>Let’s plan your talk 🎤</h2>' +
      "<h3>" +
      topic +
      "</h3>" +
      '<p class="topic-ideas-category">' +
      guide.category +
      "</p>" +
      '<div class="topic-ideas-grid">' +
      "<section>" +
      '<p class="topic-ideas-section-title">1. How to start (hook)</p>' +
      "<ul>" +
      hookList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">2. Clear structure</p>' +
      "<ul>" +
      structureList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">3. What you can talk about</p>' +
      "<ul>" +
      ideasList +
      "</ul>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">4. Useful phrases</p>' +
      '<p class="topic-ideas-phrases">' +
      phrases +
      "</p>" +
      "</section>" +
      "<section>" +
      '<p class="topic-ideas-section-title">5. Topic facts & ideas</p>' +
      '<p class="topic-ideas-content-intro">' +
      content.intro +
      "</p>" +
      "<ul>" +
      contentList +
      "</ul>" +
      (content.extra
        ? '<p class="topic-ideas-content-extra">' + content.extra + "</p>"
        : "") +
      "</section>" +
      "</div>" +
      "</div>";

    topicIdeas.classList.add("topic-ideas--visible");
  }

  // ========= 6. BUTTONS =========
  topicButton.addEventListener("click", pickRandomTopic);

  if (topicLikeButton) {
    topicLikeButton.addEventListener("click", function () {
      if (!currentTopic) {
        pickRandomTopic();
      }
      renderTopicGuide(currentTopic);
    });
  }
}

function initPresentacyWallPage() {
  const wallTabButtons = document.querySelectorAll(".wall-tab-button");
  const wallPanels = document.querySelectorAll(".wall-tab-panel");

  if (!wallTabButtons.length || !wallPanels.length) return;

  wallTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.wallTab;

      wallTabButtons.forEach((b) =>
        b.classList.remove("wall-tab-button--active")
      );
      btn.classList.add("wall-tab-button--active");

      wallPanels.forEach((panel) => {
        const isActive = panel.dataset.wallPanel === target;
        panel.classList.toggle("wall-tab-panel--active", isActive);
      });
    });
  });
}

/* ========================
   GREETING BANNER
   ======================== */

function renderUserGreeting() {
  const banner = document.getElementById("greeting-banner");
  if (!banner) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  // No user = no greeting
  if (!user) {
    banner.classList.remove("greeting-banner--visible");
    banner.innerHTML = "";
    return;
  }

  const fullName = user.name || "";
  const firstName = fullName.split(" ")[0] || fullName;

  const mainLines = [
    `Hey ${firstName}, ready to show your voice again?`,
    `${firstName}, your next great presentation is loading…`,
    `Welcome back, ${firstName}. Let’s make this week 1% better.`,
    `${firstName}, your audience is waiting for you 👀`,
    `Hi ${firstName}! Presentacy is happy you’re here.`
  ];

  const subLines = [
    "Every presentation is practice, not a performance.",
    "Your ideas matter more than perfect grammar.",
    "Nervous is normal. Brave is talking anyway.",
    "Tiny improvements every week become big changes.",
    "You don’t have to be perfect, just a bit clearer than last time."
  ];

  const main =
    mainLines[Math.floor(Math.random() * mainLines.length)];
  const sub =
    subLines[Math.floor(Math.random() * subLines.length)];

  const initial = firstName.charAt(0).toUpperCase();

  banner.innerHTML = `
    <div class="greeting-avatar">${initial}</div>
    <div>
      <div class="greeting-text-main">${main}</div>
      <div class="greeting-text-sub">${sub}</div>
    </div>
  `;

  requestAnimationFrame(() => {
    banner.classList.add("greeting-banner--visible");
  });
}

/* ========================
   STUDENT STORY HELPERS
   ======================== */

function getMotivationText(week1Score) {
  if (week1Score === 0) {
    return "You haven’t presented yet. Your score will appear after your first presentation.";
  }
  if (week1Score >= 24) {
    return "Amazing work. Keep challenging yourself with tougher topics and stronger stories.";
  }
  if (week1Score >= 16) {
    return "Strong start. Choose one skill to push higher next time – eye contact, body language, or voice.";
  }
  if (week1Score >= 8) {
    return "Nice first steps. Focus on one small change next presentation and your score will grow quickly.";
  }
  return "You were brave enough to stand and speak. That’s the hardest part – keep going.";
}

function getStudentProgressStory(student) {
  const scores = student.scores || {};
  const entries = Object.entries(scores).filter(
    ([, value]) => typeof value === "number"
  );

  if (entries.length === 0) {
    return "Your first score will appear here after your first presentation. Get ready.";
  }

  if (entries.length === 1) {
    const weekKey = entries[0][0];
    const weekNumber = weekKey.replace("week", "");
    const score = entries[0][1];
    return `You’ve completed your first Presentacy in week ${weekNumber} with ${score} points. Great start — the next step is even more important.`;
  }

  entries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  const firstScore = entries[0][1];
  const lastScore = entries[entries.length - 1][1];

  if (lastScore > firstScore) {
    return `You’ve presented ${entries.length} times so far, and your score went up from ${firstScore} to ${lastScore}. That’s called progress — keep going.`;
  } else if (lastScore < firstScore) {
    return `You’ve presented ${entries.length} times. This week was a bit lower (${lastScore} vs ${firstScore}), but one score doesn’t define you. Learn and try again.`;
  } else {
    return `You’ve presented ${entries.length} times so far. Your score stayed steady at ${lastScore}; now try one new thing (like stronger eye contact or clearer voice).`;
  }
}

// ===============================
//  STUDENT RESULT CARD
// ===============================
function renderStudentResultCard(student, targetEl) {
  if (!targetEl) return;

  if (!student) {
    targetEl.innerHTML = `
      <p class="student-message">
        No matching student was found. Please check the name and class.
      </p>
    `;
    return;
  }

  const scores = student.scores || {};
  const weekEntries = Object.entries(scores);

  // Sort by week number (week1, week2, ...)
  weekEntries.sort((a, b) => {
    const numA = parseInt(a[0].replace("week", ""), 10) || 0;
    const numB = parseInt(b[0].replace("week", ""), 10) || 0;
    return numA - numB;
  });

  let weeksHtml = "";

  if (weekEntries.length === 0) {
    weeksHtml = `<p>No scores recorded yet.</p>`;
  } else {
    weeksHtml = weekEntries
      .map(([weekKey, score]) => {
        const weekNumber = weekKey.replace("week", "");
        return `<p>Week ${weekNumber}: <strong>${score}</strong> points</p>`;
      })
      .join("");
  }

  // Week 1 score for the motivation line
  const week1Score =
    typeof scores.week1 === "number" ? scores.week1 : 0;
  const motivation = getMotivationText(week1Score);

  targetEl.innerHTML = `
    <div class="student-result-card">
      <div class="student-result-header">
        <div class="student-result-name">${student.name}</div>
        <div class="student-result-class">${student.class}</div>
      </div>

      <div class="student-weeks">
        ${weeksHtml}
      </div>

      <p class="motivation">${motivation}</p>
    </div>
  `;
}

/* ========================
   STUDENT VIEW ON LEADERBOARD
   ======================== */

function setupStudentViewOnLeaderboard(currentUser) {
  const searchSection = document.getElementById("student-search");
  const resultEl = document.getElementById("student-result");

  if (!searchSection || !resultEl) return;

  const titleEl = searchSection.querySelector("h1");
  const infoPara = searchSection.querySelector("p");
  const searchRow = searchSection.querySelector(".search-row");

  // Hide the search (class + name + button) for students
  if (searchRow) {
    searchRow.style.display = "none";
  }

  if (titleEl) {
    titleEl.textContent = "Your Presentacy Score";
  }

  if (infoPara) {
    infoPara.textContent = `This card shows your score for each week, ${currentUser.name}.`;
  }

  const me = STUDENTS.find(
    (s) =>
      (s.username || "").trim().toLowerCase() ===
      (currentUser.username || "").trim().toLowerCase()
  );

  if (!me) {
    resultEl.innerHTML = `
      <p class="student-message">
        You are logged in as <strong>${currentUser.name}</strong>,
        but we couldn’t find your data. Please tell your teacher.
      </p>
    `;
    return;
  }

  resultEl.innerHTML = `
    <p class="student-message">
      Hi <strong>${me.name}</strong> (${me.class}) 👋  
      Here is your Presentacy score for each week:
    </p>
  `;
  renderStudentResultCard(me, resultEl);
}

/* ========================
   WORDLE REACTION
   ======================== */

function presentacyShowWordleReaction(isWin, solutionWord) {
  const banner = document.getElementById("wordle-reaction");
  if (!banner) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  const fullName = user?.name || "";
  const firstName = fullName.split(" ")[0] || "presenter";

  let emoji;
  let text;
  let extraClass;

  if (isWin) {
    emoji = "🎉";
    extraClass = "reaction-banner--success";
    text = `Nice one, ${firstName}! You cracked today’s word: ${solutionWord.toUpperCase()}. One small win for your brain, one big win for your Presentacy.`;
  } else {
    emoji = "💪";
    extraClass = "reaction-banner--fail";
    text = `Almost there, ${firstName}. You didn’t get today’s word (${solutionWord.toUpperCase()}), but showing up again tomorrow is what really trains your speaking brain.`;
  }

  banner.className = "reaction-banner reaction-banner--visible " + extraClass;
  banner.innerHTML = `
    <span class="reaction-emoji">${emoji}</span>
    <span>${text}</span>
  `;
}

function showWordleWinMessage(secretWord) {
  const msgEl = document.getElementById("wordle-message");
  if (!msgEl) return;

  const user = getPresentacyCurrentUser();
  const first = user ? getFirstName(user.name || user.username) : "Presentacy star";

  msgEl.textContent = `Great job, ${first}! You found today’s word: ${secretWord}.`;
  msgEl.classList.add("wordle-message-success");
}

/* ========================
   VIDEO REACTIONS
   ======================== */

function initVideoReactions() {
  const cards = document.querySelectorAll(".video-card");
  if (!cards.length) return;

  const user = presentacyGetCurrentUser && presentacyGetCurrentUser();
  const fullName = user?.name || "";
  const firstName = fullName.split(" ")[0] || "presenter";

  cards.forEach((card) => {
    const label = card.getAttribute("data-video-label") || "this video";
    const button = card.querySelector(".video-watch-btn");
    const reactionEl = card.querySelector(".video-reaction");
    if (!button || !reactionEl) return;

    button.addEventListener("click", () => {
      reactionEl.innerHTML = `
        ✅ Nice choice, <strong>${firstName}</strong>. 
        Try one idea from <em>${label}</em> in your next presentation.
      `;
    });
  });
}

/* ========================
   DOMContentLoaded – FINAL
   ======================== */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page") || "";

  // Common for all pages
  if (typeof setupNavHighlight === "function") setupNavHighlight();
  if (typeof setupMobileNav === "function") setupMobileNav();
  if (typeof setupLogoutButton === "function") setupLogoutButton();

  // Home hero stuff
  if (typeof updateHomeHeroCard === "function") updateHomeHeroCard();
  if (typeof updateHomeHeroCard === "function") {
  updateHomeHeroCard();
}

  // Page-specific inits
  if (typeof initHomePage === "function") initHomePage();
  if (typeof initGeneratorPage === "function") initGeneratorPage();
  if (typeof initPresentacyWallPage === "function") initPresentacyWallPage();

  if (page === "login" && typeof initPresentacyLoginPage === "function") {
    initPresentacyLoginPage();
    return;
  }

  if (page === "leaderboard" && typeof initLeaderboardPage === "function") {
    initLeaderboardPage();
  }

  if (page === "videos" && typeof initVideoReactions === "function") {
    initVideoReactions();
  }
});

// ============================
// 7. ONE CLEAN DOMContentLoaded
// ============================
function getFirstName(fullName) {
  if (!fullName) return "";
  return fullName.trim().split(/\s+/)[0];
}

// Returns "First Last" (first two names) for the badge
function getFirstTwoNames(fullName) {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[1];
}

// Updates the big hero rectangle text
function updateHomeHeroCard() {
  const mainLine = document.getElementById("home-hero-main");
  const subLine  = document.getElementById("home-hero-sub");
  if (!mainLine || !subLine) return;

  const currentUser =
    (typeof presentacyGetCurrentUser === "function"
      ? presentacyGetCurrentUser()
      : null);

  // Nobody logged in → generic text
  if (!currentUser) {
    mainLine.textContent = "Welcome to Presentacy";
    subLine.textContent  = "Track your presentations and see your progress.";
    return;
  }

  const hour = new Date().getHours();
  let prefix = "Welcome";
  if (hour < 12) prefix = "Good morning";
  else if (hour < 18) prefix = "Good afternoon";
  else prefix = "Good evening";

  const fullName = currentUser.name || currentUser.username || "";
  const first = getFirstName(fullName);

  // Main greeting line
  mainLine.textContent = `${prefix}, ${first}!`;

  // Second line – slightly different for teacher vs student
  if (currentUser.role === "teacher") {
    subLine.textContent =
      "Check your scores, see the leaderboard, and get ready for the next Presentacy.";
  } else {
    subLine.textContent =
      "Check your scores, see the leaderboard, and get ready for your next Presentacy.";
  }
}

// Updates the circle avatar + name badge on the left
function updateHomeHeroUserBadge() {
  const avatarEl = document.getElementById("home-hero-avatar");
  const nameEl   = document.getElementById("home-hero-name");
  if (!avatarEl || !nameEl) return;

  const user =
    (typeof presentacyGetCurrentUser === "function"
      ? presentacyGetCurrentUser()
      : null);
  if (!user) return;

  const fullName = (user.name || user.username || "").trim();
  if (!fullName) return;

  // Text under the circle → "First Last"
  nameEl.textContent = getFirstTwoNames(fullName);

  // First letter inside the circle
  const firstLetter = fullName[0];
  if (firstLetter) {
    avatarEl.textContent = firstLetter.toUpperCase();
  }
}

// ---------- My Scores helpers ----------

// Find a student in the STUDENTS array by username (case-insensitive)
function findStudentByUsername(username) {
  if (!username) return null;
  const target = username.trim().toLowerCase();
  return STUDENTS.find((s) => (s.username || "").trim().toLowerCase() === target) || null;
}

// Build a small table with week1, week2, ... scores
function buildWeeksTable(student) {
  const scores = (student && student.scores) || {};
  const entries = Object.entries(scores).filter(([key]) => /^week\d+$/i.test(key));

  if (!entries.length) {
    return `
      <p class="myscores-muted">
        No presentation scores yet. Once you start presenting, your points will appear here.
      </p>
    `;
  }

  const rows = entries
    .map(([key, value]) => {
      const weekLabel = key.replace(/week/i, "Week ");
      const safeValue = typeof value === "number" ? value : "–";
      return `<tr><td>${weekLabel}</td><td>${safeValue}</td></tr>`;
    })
    .join("");

  return `
    <table class="myscores-table">
      <thead>
        <tr>
          <th>Week</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Get unique class list for the teacher dropdown
function getAllClasses() {
  const set = new Set();
  STUDENTS.forEach((s) => {
    if (s.class) set.add(s.class);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function setupStudentMyScoresView(currentUser) {
  const statusEl = document.getElementById("myscores-status");
  const totalEl = document.getElementById("myscores-total");
  const badgeEl = document.getElementById("myscores-badge");
  const weeksContainer = document.getElementById("myscores-weeks");
  const rubricsEl = document.getElementById("myscores-rubrics");

  if (!statusEl || !totalEl || !badgeEl || !weeksContainer || !rubricsEl) return;

  if (!currentUser || !currentUser.username) {
    statusEl.textContent = "Please log in first to see your Presentacy score.";
    totalEl.textContent = "–";
    badgeEl.textContent = "–";
    weeksContainer.innerHTML = "";
    rubricsEl.innerHTML = "";
    return;
  }

  // Reset UI
  statusEl.textContent = "Loading your latest score…";
  totalEl.textContent = "–";
  badgeEl.textContent = "–";
  weeksContainer.innerHTML = "";
  rubricsEl.innerHTML = "";

  // If the backend URL is not configured yet
 // If the backend URL is not configured yet
if (
  !RUBRICS_API_URL ||
  RUBRICS_API_URL === "https://script.google.com/macros/s/AKfycbxpjKvYddIV_paMpSTJB5DTT3o_xGK8O2n8fHsy2jCYDmo6c9jQnTmFiMDlvWxpilk1/exec"
) {
  statusEl.textContent =
    "Scores are not connected yet. Please tell your teacher so they can link the spreadsheet.";
  return;
}

  const username = (currentUser.username || "").trim().toLowerCase();
  if (!username) {
    statusEl.textContent = "We could not read your username. Please log in again or tell your teacher.";
    return;
  }

  const params = new URLSearchParams({
    action: "myscore",
    username: username
  });

  fetch(`${RUBRICS_API_URL}?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.ok) {
        statusEl.textContent =
          (data && data.error) ||
          "We couldn’t load your score yet. Please ask your teacher to check the spreadsheet.";
        return;
      }

      if (!data.result) {
        statusEl.textContent =
          data.message ||
          "No rubric rows found yet for this student. After your first presentation, your score will appear here.";
        return;
      }

      const result = data.result || {};
      const total = typeof result.totalPoints === "number" ? result.totalPoints : 0;

      // Summary area
      if (total > 0) {
        totalEl.textContent = total;
      } else {
        totalEl.textContent = "–";
      }

      const badgeInfo = calculateBadge(total);
      badgeEl.textContent = badgeInfo.label || badgeInfo.text || "Presentacy Speaker";

      const week = result.week || "";
      const topic = result.topic || "";
      const className = result.class || currentUser.class || "";
      const teacherName = result.teacher || "";

      weeksContainer.innerHTML = `
        <table class="myscores-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Topic</th>
              <th>Total points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${week || "–"}</td>
              <td>${topic || "–"}</td>
              <td>${total || 0}</td>
            </tr>
          </tbody>
        </table>
      `;

      // Rubric breakdown – LETTERS ONLY for students
      const rubricLetters = result.rubricsLetters || {};
      const rubricKeys = Object.keys(rubricLetters);

      if (!rubricKeys.length) {
        rubricsEl.innerHTML = `
          <p class="myscores-muted">
            Your teacher has not added detailed rubric scores yet. Once they are added, they will appear here.
          </p>
        `;
      } else {
        const rows = rubricKeys
          .map((key) => {
            const letter = rubricLetters[key] || "";
            const safeLabel = String(key)
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");

            return `
              <tr>
                <td>${safeLabel}</td>
                <td>${letter}</td>
              </tr>
            `;
          })
          .join("");

        rubricsEl.innerHTML = `
          <table class="myscores-table rubrics-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      }

      statusEl.textContent = "";
    })
    .catch((err) => {
      console.error("Error loading myscore", err);
      statusEl.textContent =
        "We had a problem loading your score. Please try again later or tell your teacher.";
    });
}
function setupTeacherMyScoresView() {
  const classSelect = document.getElementById("teacher-myscores-class");
  const nameInput = document.getElementById("teacher-myscores-name");
  const searchBtn = document.getElementById("teacher-myscores-search");
  const statusEl = document.getElementById("teacher-myscores-status");
  const resultEl = document.getElementById("teacher-myscores-result");

  if (!classSelect || !nameInput || !searchBtn || !statusEl || !resultEl) return;

  // Fill classes dropdown from static STUDENTS list
  const classes = getAllClasses();
  classSelect.innerHTML =
    `<option value="">All classes</option>` +
    classes.map((c) => `<option value="${c}">${c}</option>`).join("");

  function performSearch() {
    const classFilter = classSelect.value;
    const nameQuery = nameInput.value.trim().toLowerCase();

    resultEl.innerHTML = "";

    if (!nameQuery) {
      statusEl.textContent = "Type at least part of the student’s name.";
      return;
    }

    const matches = STUDENTS.filter((s) => {
      const matchClass =
  !classFilter || (s.class || "").toLowerCase() === classFilter.toLowerCase();
      const matchName =
        (s.name || "").toLowerCase().includes(nameQuery) ||
        (s.username || "").toLowerCase().includes(nameQuery);
      return matchClass && matchName;
    });

    if (!matches.length) {
      statusEl.textContent = "No students found with that name in this class.";
      return;
    }

    if (matches.length > 1) {
      statusEl.textContent =
        "More than one student matched. Please type the full name or username.";
      return;
    }

    const student = matches[0];
    loadTeacherStudentRubrics(student);
  }

  function loadTeacherStudentRubrics(student) {
    const username = (student.username || "").trim().toLowerCase();
    if (!username) {
      statusEl.textContent = "This student does not have a username set.";
      resultEl.innerHTML = "";
      return;
    }

    // ❗ No more "Scores are not connected yet" check here.
    // We always try to call the backend URL you set.
    statusEl.textContent = `Loading detailed scores for ${student.name}…`;
    resultEl.innerHTML = "";

    const params = new URLSearchParams({
      action: "studentrubrics",
      username: username
    });

    const url = `${RUBRICS_API_URL}?${params.toString()}`;
    console.log("Teacher fetching:", url);

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Network error");
        return response.json();
      })
      .then((data) => {
        if (!data || !data.ok) {
          statusEl.textContent =
            (data && data.error) ||
            "We couldn’t load this student’s scores from the spreadsheet.";
          resultEl.innerHTML = "";
          return;
        }

        const rubricRows = data.rubricRows || [];
        const info = data.student || {};

        if (!rubricRows.length) {
          statusEl.textContent =
            "No rubric rows found yet for this student in the spreadsheet.";
          resultEl.innerHTML = `
            <article class="student-card">
              <h3>${student.name}</h3>
              <p class="myscores-muted">Class: ${student.class || info.class || "-"}</p>
              <p><strong>Total points:</strong> 0</p>
              <p><strong>Badge:</strong> Rising Star</p>
            </article>
          `;
          return;
        }

        statusEl.textContent = "";

        // Unique list of weeks
        const weekSet = new Set();
        rubricRows.forEach((row) => {
          if (row.week && String(row.week).trim() !== "") {
            weekSet.add(String(row.week).trim());
          }
        });
        const weekList = Array.from(weekSet).sort((a, b) => Number(a) - Number(b));

        const latestRow = rubricRows[rubricRows.length - 1];
        const latestTotal =
          typeof latestRow.totalPoints === "number" ? latestRow.totalPoints : 0;
        const badgeLabel = getBadgeForPoints(latestTotal);

        resultEl.innerHTML = `
          <article class="student-card">
            <h3>${student.name}</h3>
            <p class="myscores-muted">Class: ${student.class || info.class || "-"}</p>
            <p><strong>Total points (latest):</strong> ${latestTotal}</p>
            <p><strong>Badge:</strong> ${badgeLabel}</p>

            <div class="teacher-week-filter" style="margin-top: 1rem;">
              <label class="form-field">
                <span class="form-label">Week</span>
                <select id="teacher-week-select" class="input">
                  <option value="latest">Latest</option>
                  ${weekList
                    .map((w) => `<option value="${w}">Week ${w}</option>`)
                    .join("")}
                </select>
              </label>
            </div>

            <div id="teacher-week-summary" class="teacher-week-summary" style="margin-top: 1rem;"></div>
            <div id="teacher-week-rubrics" class="teacher-week-rubrics" style="margin-top: 1rem;"></div>
          </article>
        `;

        const weekSelect = document.getElementById("teacher-week-select");
        const summaryEl = document.getElementById("teacher-week-summary");
        const rubricsEl = document.getElementById("teacher-week-rubrics");

        function renderWeek(selectedValue) {
          let row;

          if (selectedValue === "latest" || !selectedValue) {
            row = latestRow;
          } else {
            row =
              rubricRows.find(
                (r) => String(r.week || "").trim() === String(selectedValue).trim()
              ) || latestRow;
          }

          const total =
            typeof row.totalPoints === "number" ? row.totalPoints : 0;
          const badge = getBadgeForPoints(total);
          const weekLabel = row.week ? `Week ${row.week}` : "Latest";
          const topic = row.topic || "";
          const teacherName = row.teacher || "";

          summaryEl.innerHTML = `
            <p><strong>Selected:</strong> ${weekLabel}</p>
            <p><strong>Topic:</strong> ${topic || "–"}</p>
            <p><strong>Total points:</strong> ${total}</p>
            <p><strong>Badge:</strong> ${badge}</p>
            <p><strong>Teacher:</strong> ${teacherName || "–"}</p>
          `;

          const nums = row.rubricsNumbers || {};
          const letters = row.rubricsLetters || {};
          const keys = Object.keys(nums);

          if (!keys.length) {
            rubricsEl.innerHTML = `
              <p class="myscores-muted">
                No detailed rubric scores were found for this week.
              </p>
            `;
            return;
          }

          const rowsHtml = keys
            .map((key) => {
              const safeLabel = String(key)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
              const num = nums[key];
              const letter = letters[key] || "";
              const safeNum =
                typeof num === "number"
                  ? num
                  : num !== undefined && num !== null
                  ? num
                  : "–";

              return `
                <tr>
                  <td>${safeLabel}</td>
                  <td>${safeNum}</td>
                  <td>${letter}</td>
                </tr>
              `;
            })
            .join("");

          rubricsEl.innerHTML = `
            <table class="myscores-table rubrics-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Score</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          `;
        }

        renderWeek("latest");

        if (weekSelect) {
          weekSelect.addEventListener("change", () => {
            renderWeek(weekSelect.value);
          });
        }
      })
      .catch((err) => {
        console.error("Error loading studentrubrics", err);
        statusEl.textContent =
          "We had a problem loading this student’s scores. Please try again later.";
        resultEl.innerHTML = "";
      });
  }

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    performSearch();
  });

  nameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      performSearch();
    }
  });
}

function initMyScoresPage() {
  const raw = localStorage.getItem("presentacy_current_user");
  let currentUser = null;

  try {
    currentUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    currentUser = null;
  }

  const studentSection = document.getElementById("myscores-student-section");
  const teacherSection = document.getElementById("myscores-teacher-section");

  if (!currentUser) {
    // Not logged in – hide both sections
    if (studentSection) studentSection.style.display = "none";
    if (teacherSection) teacherSection.style.display = "none";

    const statusEl = document.getElementById("myscores-status");
    if (statusEl) {
      statusEl.textContent = "Please log in first to see scores.";
    }
    return;
  }

  // Teacher vs student
  if (currentUser.role === "teacher") {
    if (studentSection) studentSection.style.display = "none";
    if (teacherSection) teacherSection.style.display = "block";
    setupTeacherMyScoresView();
  } else {
    if (teacherSection) teacherSection.style.display = "none";
    if (studentSection) studentSection.style.display = "block";
    setupStudentMyScoresView(currentUser);
  }
}

// ========================
// DOMContentLoaded – FINAL
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page") || "";

  // Common for all pages
  if (typeof setupNavHighlight === "function") setupNavHighlight();
  if (typeof setupMobileNav === "function") setupMobileNav();
  if (typeof setupLogoutButton === "function") setupLogoutButton();
  if (typeof applyRoleBasedNav === "function") applyRoleBasedNav();

  // Home hero (greeting + badge)
  if (typeof updateHomeHeroCard === "function") updateHomeHeroCard();
  if (typeof updateHomeHeroUserBadge === "function") updateHomeHeroUserBadge();

  // If you still want the old navbar greeting, keep this line.
  // If you DON'T want it, just delete this next line:
  // if (typeof renderUserGreeting === "function") renderUserGreeting();

  // Page-specific inits
  if (typeof initHomePage === "function") initHomePage();
  if (typeof initGeneratorPage === "function") initGeneratorPage();
  if (typeof initPresentacyWallPage === "function") initPresentacyWallPage();

  if (page === "login" && typeof initPresentacyLoginPage === "function") {
    initPresentacyLoginPage();
    return;
  }

  if (page === "leaderboard" && typeof initLeaderboardPage === "function") {
    initLeaderboardPage();
  }

  if (page === "videos" && typeof initVideoReactions === "function") {
    initVideoReactions();
  }

    if (page === "myscores" && typeof initMyScoresPage === "function") {
    initMyScoresPage();
  }

    // ============================
  // TEACHER RUBRICS: stay on page + popup on save
  // ============================
  const rubricsForm = document.getElementById("rubrics-form");
  const rubricsFrame = document.getElementById("rubrics-saver-frame");

  if (rubricsForm && rubricsFrame) {
    let firstLoad = true; // ignore the first empty load of the iframe

    rubricsFrame.addEventListener("load", () => {
      if (firstLoad) {
        firstLoad = false;
        return;
      }

      // At this point Apps Script has replied → the row should be saved
      alert("Rubrics saved! You can enter the next student.");

      // Clear the form for the next student
      rubricsForm.reset();

      // Optional: put the cursor back on the student select / input
      const studentField =
        rubricsForm.querySelector('[name="student"]') ||
        rubricsForm.querySelector('[name="studentId"]');
      if (studentField) {
        studentField.focus();
      }
    });
  }
});
