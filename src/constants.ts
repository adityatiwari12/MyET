export interface Story {
  id: string;
  title: string;
  category: string;
  readTime: string;
  updateInfo?: string;
  insights: string[];
  mattersToYou: string;
  tags: string[];
  imageUrl: string;
  content?: string;
  titleHi?: string;
  categoryHi?: string;
  readTimeHi?: string;
  updateInfoHi?: string;
  insightsHi?: string[];
  mattersToYouHi?: string;
  contentHi?: string;
}

export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: "RBI’s Repo Rate Stance: What it means for your Home Loan EMI",
    titleHi: "RBI का रेपो रेट रुख: आपके होम लोन ईएमआई के लिए इसका क्या मतलब है",
    category: "Monetary Policy",
    categoryHi: "मौद्रिक नीति",
    readTime: "5 MIN READ",
    readTimeHi: "5 मिनट की पढ़ाई",
    updateInfo: "Personalized for you • Breaking",
    updateInfoHi: "आपके लिए व्यक्तिगत • ब्रेकिंग",
    insights: [
      "The RBI has maintained the repo rate at 6.5%, focusing on 'withdrawal of accommodation'.",
      "Banks are expected to keep MCLR rates stable, providing temporary relief to floating-rate borrowers.",
      "Inflation remains a key concern, with food prices keeping the MPC on high alert."
    ],
    insightsHi: [
      "RBI ने रेपो रेट को 6.5% पर बरकरार रखा है, 'समायोजन की वापसी' पर ध्यान केंद्रित किया है।",
      "बैंकों से MCLR दरों को स्थिर रखने की उम्मीद है, जिससे फ्लोटिंग-रेट उधारकर्ताओं को अस्थायी राहत मिलेगी।",
      "मुद्रास्फीति एक प्रमुख चिंता बनी हुई है, खाद्य कीमतें MPC को हाई अलर्ट पर रख रही हैं।"
    ],
    mattersToYou: "Based on your personalized profile and interest in \"Indian Real Estate\", this pause suggests a window of stability for your upcoming property investment in Bangalore.",
    mattersToYouHi: "आपकी व्यक्तिगत प्रोफ़ाइल और \"भारतीय रियल एस्टेट\" में रुचि के आधार पर, यह ठहराव बैंगलोर में आपके आगामी संपत्ति निवेश के लिए स्थिरता की खिड़की का सुझाव देता है।",
    tags: ["RBI", "EMI", "ECONOMY", "INDIA"],
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000",
    content: `The Reserve Bank of India's Monetary Policy Committee (MPC) has once again decided to keep the policy repo rate unchanged at 6.50%. This decision, while expected by most economists, carries significant weight for the Indian middle class, particularly those with home loans.

Governor Shaktikanta Das emphasized that while the Indian economy is showing robust growth, the fight against inflation is far from over. "The elephant has gone for a walk," he noted, referring to inflation, but warned that it could return if vigilance is lowered.

For the average borrower, this means that EMIs are unlikely to decrease in the immediate future. However, the stability provides a predictable environment for financial planning. Analysts suggest that any rate cuts might only be considered in the second half of the fiscal year, depending on the monsoon's impact on food inflation.`,
    contentHi: `भारतीय रिजर्व बैंक की मौद्रिक नीति समिति (MPC) ने एक बार फिर नीतिगत रेपो दर को 6.50% पर अपरिवर्तित रखने का निर्णय लिया है। यह निर्णय, हालांकि अधिकांश अर्थशास्त्रियों द्वारा अपेक्षित था, भारतीय मध्यम वर्ग के लिए महत्वपूर्ण वजन रखता है, विशेष रूप से उन लोगों के लिए जिनके पास होम लोन है।

गवर्नर शक्तिकांत दास ने जोर देकर कहा कि हालांकि भारतीय अर्थव्यवस्था मजबूत विकास दिखा रही है, लेकिन मुद्रास्फीति के खिलाफ लड़ाई अभी खत्म नहीं हुई है। "हाथी टहलने गया है," उन्होंने मुद्रास्फीति का जिक्र करते हुए कहा, लेकिन चेतावनी दी कि अगर सतर्कता कम की गई तो यह वापस आ सकता है।

औसत उधारकर्ता के लिए, इसका मतलब है कि निकट भविष्य में ईएमआई कम होने की संभावना नहीं है। हालांकि, स्थिरता वित्तीय योजना के लिए एक पूर्वानुमेय वातावरण प्रदान करती है। विश्लेषकों का सुझाव है कि मानसून के खाद्य मुद्रास्फीति पर प्रभाव के आधार पर, वित्त वर्ष की दूसरी छमाही में ही किसी भी दर कटौती पर विचार किया जा सकता है।`
  },
  {
    id: '2',
    title: "Nifty 50 hits record high: Is the Indian bull run sustainable?",
    titleHi: "निफ्टी 50 रिकॉर्ड ऊंचाई पर: क्या भारतीय बुल रन टिकाऊ है?",
    category: "Equity Markets",
    categoryHi: "इक्विटी बाजार",
    readTime: "6 MIN READ",
    readTimeHi: "6 मिनट की पढ़ाई",
    updateInfo: "Personalized Insight",
    updateInfoHi: "व्यक्तिगत अंतर्दृष्टि",
    insights: [
      "Domestic institutional investors (DIIs) have pumped in over ₹25,000 crore this month.",
      "The manufacturing sector's PMI reached a 16-year high, signaling strong underlying growth.",
      "Global brokerage firms have upgraded India's weightage in their emerging market portfolios."
    ],
    insightsHi: [
      "घरेलू संस्थागत निवेशकों (DII) ने इस महीने ₹25,000 करोड़ से अधिक का निवेश किया है।",
      "विनिर्माण क्षेत्र का PMI 16 साल के उच्च स्तर पर पहुंच गया, जो मजबूत अंतर्निहित विकास का संकेत देता है।",
      "वैश्विक ब्रोकरेज फर्मों ने अपने उभरते बाजार पोर्टफोलियो में भारत का वेटेज बढ़ाया है।"
    ],
    mattersToYou: "You recently tracked \"Nifty IT Index\". This personalized update indicates that while the broader market is at a peak, IT stocks are still trading at attractive valuations relative to their 5-year average.",
    mattersToYouHi: "आपने हाल ही में \"निफ्टी आईटी इंडेक्स\" को ट्रैक किया है। यह व्यक्तिगत अपडेट इंगित करता है कि जबकि व्यापक बाजार चरम पर है, आईटी स्टॉक अभी भी अपने 5 साल के औसत के सापेक्ष आकर्षक मूल्यांकन पर कारोबार कर रहे हैं।",
    tags: ["NIFTY", "STOCK MARKET", "INVESTING"],
    imageUrl: "https://images.unsplash.com/photo-1611974717484-7da00ff12991?auto=format&fit=crop&q=80&w=1000",
    content: `The Indian stock market continues its relentless climb, with the Nifty 50 and Sensex hitting fresh all-time highs. This rally is driven by a combination of strong corporate earnings, robust domestic liquidity, and a positive outlook on the Indian economy's long-term growth trajectory.

Retail participation through SIPs (Systematic Investment Plans) has reached record levels, providing a stable floor for the markets even during global volatility. However, some analysts are sounding a note of caution, pointing to high valuations in the mid-cap and small-cap segments.

"The India story is structural, not just cyclical," says a leading fund manager. "While short-term corrections are always possible, the long-term trend remains firmly upward as India moves toward becoming the world's third-largest economy."`,
    contentHi: `भारतीय शेयर बाजार अपनी निरंतर चढ़ाई जारी रखे हुए है, निफ्टी 50 और सेंसेक्स नई सर्वकालिक ऊंचाई पर पहुंच गए हैं। यह रैली मजबूत कॉर्पोरेट आय, मजबूत घरेलू तरलता और भारतीय अर्थव्यवस्था के दीर्घकालिक विकास पथ पर सकारात्मक दृष्टिकोण के संयोजन से प्रेरित है।

SIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) के माध्यम से खुदरा भागीदारी रिकॉर्ड स्तर पर पहुंच गई है, जो वैश्विक अस्थिरता के दौरान भी बाजारों के लिए एक स्थिर आधार प्रदान करती है। हालांकि, कुछ विश्लेषक सावधानी बरत रहे हैं, मिड-कैप और स्मॉल-कैप सेगमेंट में उच्च मूल्यांकन की ओर इशारा कर रहे हैं।

"इंडिया स्टोरी संरचनात्मक है, न कि केवल चक्रीय," एक प्रमुख फंड मैनेजर कहते हैं। "जबकि अल्पकालिक सुधार हमेशा संभव होते हैं, दीर्घकालिक प्रवृत्ति मजबूती से ऊपर की ओर बनी हुई है क्योंकि भारत दुनिया की तीसरी सबसे बड़ी अर्थव्यवस्था बनने की ओर बढ़ रहा है।"`
  },
  {
    id: '3',
    title: "The Rise of Fintech in Tier 2 India: Beyond UPI",
    titleHi: "टियर 2 भारत में फिनटेक का उदय: UPI से परे",
    category: "Fintech",
    categoryHi: "फिनटेक",
    readTime: "4 MIN READ",
    readTimeHi: "4 मिनट की पढ़ाई",
    updateInfo: "Personalized Trend",
    updateInfoHi: "व्यक्तिगत रुझान",
    insights: [
      "Digital lending apps are seeing a 40% YoY growth in small-town India.",
      "Wealth-tech platforms are recording a surge in mutual fund investments from first-time users in rural areas.",
      "Insurance-tech is the next big frontier as penetration remains low in non-metro cities."
    ],
    insightsHi: [
      "डिजिटल लेंडिंग ऐप्स छोटे शहरों में 40% की सालाना वृद्धि देख रहे हैं।",
      "वेल्थ-टेक प्लेटफॉर्म ग्रामीण क्षेत्रों में पहली बार उपयोगकर्ताओं से म्यूचुअल फंड निवेश में उछाल दर्ज कर रहे हैं।",
      "बीमा-टेक अगला बड़ा मोर्चा है क्योंकि गैर-मेट्रो शहरों में पैठ कम बनी हुई है।"
    ],
    mattersToYou: "Your personalized interest in \"Digital Transformation\" aligns with this trend. The shift from payments to credit and investments in Tier 2 cities is creating new opportunities for the startups you follow.",
    mattersToYouHi: " \"डिजिटल ट्रांसफॉर्मेशन\" में आपकी व्यक्तिगत रुचि इस प्रवृत्ति के अनुरूप है। टियर 2 शहरों में भुगतान से क्रेडिट और निवेश की ओर बदलाव आपके द्वारा फॉलो किए जाने वाले स्टार्टअप के लिए नए अवसर पैदा कर रहा है।",
    tags: ["FINTECH", "STARTUPS", "DIGITAL INDIA"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: '4',
    title: "Indian Startups: The 'Funding Winter' is thawing",
    titleHi: "भारतीय स्टार्टअप: 'फंडिंग विंटर' पिघल रही है",
    category: "Venture Capital",
    categoryHi: "वेंचर कैपिटल",
    readTime: "7 MIN READ",
    readTimeHi: "7 मिनट की पढ़ाई",
    updateInfo: "Personalized for you",
    updateInfoHi: "आपके लिए व्यक्तिगत",
    insights: [
      "Late-stage funding deals have increased by 25% in the last quarter.",
      "Investors are prioritizing profitability and sustainable unit economics over rapid growth.",
      "AI and Deep-tech startups are attracting the lion's share of new capital."
    ],
    insightsHi: [
      "पिछली तिमाही में लेट-स्टेज फंडिंग सौदों में 25% की वृद्धि हुई है।",
      "निवेशक तेजी से विकास के बजाय लाभप्रदता और टिकाऊ यूनिट इकोनॉमिक्स को प्राथमिकता दे रहे हैं।",
      "एआई और डीप-टेक स्टार्टअप नई पूंजी का बड़ा हिस्सा आकर्षित कर रहे हैं।"
    ],
    mattersToYou: "Based on your personalized tracking of \"Zomato\" and \"Paytm\", this recovery in sentiment suggests a potential re-rating for listed Indian tech companies.",
    mattersToYouHi: "\"Zomato\" और \"Paytm\" की आपकी व्यक्तिगत ट्रैकिंग के आधार पर, भावना में यह सुधार सूचीबद्ध भारतीय टेक कंपनियों के लिए संभावित री-रेटिंग का सुझाव देता है।",
    tags: ["VC", "STARTUPS", "FUNDING"],
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: '5',
    title: "GST Collections hit ₹1.8 Lakh Crore: A sign of robust consumption?",
    titleHi: "GST संग्रह ₹1.8 लाख करोड़ तक पहुंचा: मजबूत खपत का संकेत?",
    category: "Fiscal Policy",
    categoryHi: "राजकोषीय नीति",
    readTime: "3 MIN READ",
    readTimeHi: "3 मिनट की पढ़ाई",
    updateInfo: "Personalized Data",
    updateInfoHi: "व्यक्तिगत डेटा",
    insights: [
      "Monthly GST collections have consistently stayed above the ₹1.6 lakh crore mark.",
      "Increased compliance and a crackdown on fake invoicing are driving the numbers up.",
      "The services sector is contributing significantly to the revenue growth."
    ],
    insightsHi: [
      "मासिक जीएसटी संग्रह लगातार ₹1.6 लाख करोड़ के स्तर से ऊपर बना हुआ है।",
      "बढ़ी हुई अनुपालन और फर्जी चालान पर कार्रवाई संख्या को ऊपर ले जा रही है।",
      "सेवा क्षेत्र राजस्व वृद्धि में महत्वपूर्ण योगदान दे रहा है।"
    ],
    mattersToYou: "Your personalized focus on \"Indian Macro\" suggests that the government's fiscal deficit targets are likely to be met, potentially leading to lower government borrowing and stable bond yields.",
    mattersToYouHi: "\"इंडियन मैक्रो\" पर आपका व्यक्तिगत ध्यान बताता है कि सरकार के राजकोषीय घाटे के लक्ष्य पूरे होने की संभावना है, जिससे संभावित रूप से सरकारी उधारी कम होगी और बॉन्ड यील्ड स्थिर रहेगी।",
    tags: ["GST", "ECONOMY", "TAX"],
    imageUrl: "https://images.unsplash.com/photo-1454165833767-027ff33027ef?auto=format&fit=crop&q=80&w=1000"
  }
];

export const INTERESTS = [
  "NSE/BSE", "RBI Policy", "Indian Fintech", "Startup India",
  "Nifty IT", "Banking Sector", "Real Estate India", "GST Trends",
  "Indian Macro", "Digital Rupee", "IPO Market", "Wealth Management"
];

export const INTERESTS_HI = [
  "NSE/BSE", "RBI नीति", "भारतीय फिनटेक", "स्टार्टअप इंडिया",
  "निफ्टी आईटी", "बैंकिंग क्षेत्र", "भारतीय रियल एस्टेट", "GST रुझान",
  "भारतीय मैक्रो", "डिजिटल रुपया", "IPO बाजार", "वेल्थ मैनेजमेंट"
];
