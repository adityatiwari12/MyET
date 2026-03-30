export interface Story {
  id: string | number;
  title: string;
  category: string;
  readTime: string;
  updateInfo?: string;
  insights: string[];
  mattersToYou: string;
  tags: string[];
  imageUrl: string;
  content?: string;
  dek?: string;      // Used in Explore.tsx
  isBreaking?: boolean;
  publishedAt?: string;
  
  // Hindi equivalents
  titleHi?: string;
  categoryHi?: string;
  readTimeHi?: string;
  updateInfoHi?: string;
  insightsHi?: string[];
  mattersToYouHi?: string;
  contentHi?: string;
  dekHi?: string;
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
  },
  {
    id: '6',
    title: "Mutual Fund SIPs Hit Record ₹19,000 Crore in a Single Month",
    titleHi: "म्यूचुअल फंड SIP एक ही महीने में रिकॉर्ड ₹19,000 करोड़ पर पहुंचे",
    category: "Wealth Management",
    categoryHi: "वेल्थ मैनेजमेंट",
    readTime: "4 MIN READ",
    readTimeHi: "4 मिनट की पढ़ाई",
    updateInfo: "Personalized Insight",
    updateInfoHi: "व्यक्तिगत अंतर्दृष्टि",
    insights: [
      "Retail investors continue to show strong faith in Indian equities despite global volatility.",
      "Small-cap and mid-cap funds saw the highest inflows, indicating a higher risk appetite.",
      "The total number of SIP accounts has crossed 8.5 crore, a historic milestone."
    ],
    insightsHi: [
      "वैश्विक अस्थिरता के बावजूद खुदरा निवेशक भारतीय इक्विटी में मजबूत विश्वास दिखा रहे हैं।",
      "स्मॉल-कैप और मिड-कैप फंडों में सबसे अधिक प्रवाह देखा गया, जो उच्च जोखिम की भूख का संकेत देता है।",
      "SIP खातों की कुल संख्या 8.5 करोड़ को पार कर गई है, जो एक ऐतिहासिक मील का पत्थर है।"
    ],
    mattersToYou: "Since you track \"Wealth Management\", this trend suggests that domestic liquidity will continue to support the market, making systematic investments a reliable strategy.",
    mattersToYouHi: "चूंकि आप \"वेल्थ मैनेजमेंट\" को ट्रैक करते हैं, यह प्रवृत्ति बताती है कि घरेलू तरलता बाजार का समर्थन करना जारी रखेगी, जिससे व्यवस्थित निवेश एक विश्वसनीय रणनीति बन जाएगा।",
    tags: ["MUTUAL FUNDS", "SIP", "INVESTING"],
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1000",
    content: `Systematic Investment Plans (SIPs) have reached a new milestone, with monthly contributions crossing the ₹19,000 crore mark for the first time. This unprecedented surge underscores the growing financialization of savings in India and the retail investor's unwavering confidence in the domestic equity market.

According to data released by the Association of Mutual Funds in India (AMFI), the total assets under management (AUM) for the mutual fund industry have also hit a record high. The inflows were predominantly directed towards equity-oriented schemes, with small and mid-cap funds attracting the lion's share of new investments.

Financial advisors note that this steady stream of domestic capital is acting as a strong counterbalance to the often volatile Foreign Institutional Investor (FII) flows. "The Indian retail investor has matured," remarked a leading wealth manager. "They are no longer panic-selling during market corrections; instead, they are using dips to accumulate more units."`,
    contentHi: `सिस्टमैटिक इन्वेस्टमेंट प्लान (SIP) एक नए मील के पत्थर पर पहुंच गए हैं, जिसमें मासिक योगदान पहली बार ₹19,000 करोड़ के आंकड़े को पार कर गया है। यह अभूतपूर्व उछाल भारत में बचत के बढ़ते वित्तीयकरण और घरेलू इक्विटी बाजार में खुदरा निवेशक के अटूट विश्वास को रेखांकित करता है।

एसोसिएशन ऑफ म्यूचुअल फंड्स इन इंडिया (AMFI) द्वारा जारी आंकड़ों के अनुसार, म्यूचुअल फंड उद्योग के लिए प्रबंधन के तहत कुल संपत्ति (AUM) भी रिकॉर्ड ऊंचाई पर पहुंच गई है। प्रवाह मुख्य रूप से इक्विटी-उन्मुख योजनाओं की ओर निर्देशित था, जिसमें स्मॉल और मिड-कैप फंड नए निवेश का बड़ा हिस्सा आकर्षित कर रहे थे।

वित्तीय सलाहकारों का ध्यान है कि घरेलू पूंजी की यह स्थिर धारा अक्सर अस्थिर विदेशी संस्थागत निवेशक (FII) प्रवाह के लिए एक मजबूत संतुलन के रूप में कार्य कर रही है। "भारतीय खुदरा निवेशक परिपक्व हो गया है," एक प्रमुख वेल्थ मैनेजर ने टिप्पणी की। "वे अब बाजार सुधारों के दौरान घबराहट में नहीं बेच रहे हैं; इसके बजाय, वे अधिक इकाइयों को जमा करने के लिए गिरावट का उपयोग कर रहे हैं।"`
  },
  {
    id: '7',
    title: "India's Semiconductor Push: Tata and CG Power to Setup New Fabs",
    titleHi: "भारत का सेमीकंडक्टर पुश: टाटा और सीजी पावर नए फैब स्थापित करेंगे",
    category: "Tech & Manufacturing",
    categoryHi: "टेक और विनिर्माण",
    readTime: "6 MIN READ",
    readTimeHi: "6 मिनट की पढ़ाई",
    updateInfo: "Industry Watch",
    updateInfoHi: "उद्योग पर नज़र",
    insights: [
      "The government has approved three new semiconductor plants with an investment of ₹1.26 lakh crore.",
      "Tata Electronics will build India's first commercial semiconductor fab in Dholera, Gujarat.",
      "These projects are expected to create over 20,000 advanced technology jobs directly."
    ],
    insightsHi: [
      "सरकार ने ₹1.26 लाख करोड़ के निवेश के साथ तीन नए सेमीकंडक्टर संयंत्रों को मंजूरी दी है।",
      "टाटा इलेक्ट्रॉनिक्स गुजरात के धोलेरा में भारत का पहला वाणिज्यिक सेमीकंडक्टर फैब बनाएगा।",
      "इन परियोजनाओं से सीधे 20,000 से अधिक उन्नत प्रौद्योगिकी नौकरियां पैदा होने की उम्मीद है।"
    ],
    mattersToYou: "Your interest in \"Startup India\" and tech sectors means these fabs will create a massive downstream ecosystem for local startups in chip design and supply chain logistics.",
    mattersToYouHi: "\"स्टार्टअप इंडिया\" और टेक क्षेत्रों में आपकी रुचि का मतलब है कि ये फैब चिप डिजाइन और आपूर्ति श्रृंखला रसद में स्थानीय स्टार्टअप के लिए एक विशाल डाउनस्ट्रीम पारिस्थितिकी तंत्र बनाएंगे।",
    tags: ["SEMICONDUCTOR", "MANUFACTURING", "MAKE IN INDIA"],
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    content: `In a historic move to establish India as a global electronics manufacturing hub, the Union Cabinet has approved the establishment of three new semiconductor units. The total investment for these projects is estimated at a staggering ₹1.26 lakh crore, marking a significant leap in the country's 'Make in India' initiative.

The crown jewel of these approvals is India's first commercial semiconductor fabrication plant, which will be set up by Tata Electronics in partnership with Taiwan's Powerchip Semiconductor Manufacturing Corp (PSMC) in Dholera, Gujarat. Additionally, CG Power, in collaboration with Renesas Electronics Corp and Stars Microelectronics, will set up an OSAT (Outsourced Semiconductor Assembly and Test) facility in Sanand.

These facilities will cater to a wide range of industries, including automotive, consumer electronics, telecom, and defense. The government expects these projects to not only reduce India's reliance on imported chips but also generate substantial employment, creating a ripple effect of growth across the technology ecosystem.`,
    contentHi: `भारत को वैश्विक इलेक्ट्रॉनिक्स विनिर्माण केंद्र के रूप में स्थापित करने के एक ऐतिहासिक कदम में, केंद्रीय मंत्रिमंडल ने तीन नई सेमीकंडक्टर इकाइयों की स्थापना को मंजूरी दी है। इन परियोजनाओं के लिए कुल निवेश अनुमानित रूप से ₹1.26 लाख करोड़ है, जो देश की 'मेक इन इंडिया' पहल में एक महत्वपूर्ण छलांग है।

इन अनुमोदनों का मुख्य आकर्षण भारत का पहला वाणिज्यिक सेमीकंडक्टर फैब्रिकेशन प्लांट है, जिसे टाटा इलेक्ट्रॉनिक्स द्वारा ताइवान के पावरचिप सेमीकंडक्टर मैन्युफैक्चरिंग कॉर्प (PSMC) के साथ साझेदारी में गुजरात के धोलेरा में स्थापित किया जाएगा। इसके अतिरिक्त, CG पावर, रेनेसा इलेक्ट्रॉनिक्स कॉर्प और स्टार्स माइक्रोइलेक्ट्रॉनिक्स के सहयोग से, साणंद में एक OSAT (आउटसोर्स्ड सेमीकंडक्टर असेंबली एंड टेस्ट) सुविधा स्थापित करेगा।

ये सुविधाएं ऑटोमोटिव, उपभोक्ता इलेक्ट्रॉनिक्स, दूरसंचार और रक्षा सहित उद्योगों की एक विस्तृत श्रृंखला को पूरा करेंगी। सरकार को उम्मीद है कि ये परियोजनाएं न केवल आयातित चिप्स पर भारत की निर्भरता को कम करेंगी बल्कि पर्याप्त रोजगार भी पैदा करेंगी, जिससे प्रौद्योगिकी पारिस्थितिकी तंत्र में विकास का एक लहर प्रभाव पैदा होगा।`
  },
  {
    id: '8',
    title: "Real Estate Boom: Luxury Housing Sales Surge in NCR and Mumbai",
    titleHi: "रियल एस्टेट बूम: एनसीआर और मुंबई में लक्जरी आवास की बिक्री में उछाल",
    category: "Real Estate India",
    categoryHi: "भारतीय रियल एस्टेट",
    readTime: "5 MIN READ",
    readTimeHi: "5 मिनट की पढ़ाई",
    updateInfo: "Market Trend",
    updateInfoHi: "बाजार का रुझान",
    insights: [
      "Sales of luxury homes (priced above ₹4 crore) have jumped by 75% year-on-year.",
      "Non-Resident Indians (NRIs) account for a significant portion of these high-end purchases.",
      "Developers are shifting focus from affordable housing to premium, amenity-rich projects."
    ],
    insightsHi: [
      "लक्जरी घरों (₹4 करोड़ से अधिक कीमत वाले) की बिक्री में साल-दर-साल 75% का उछाल आया है।",
      "अनिवासी भारतीय (NRI) इन हाई-एंड खरीदारी के एक महत्वपूर्ण हिस्से के लिए जिम्मेदार हैं।",
      "डेवलपर्स किफायती आवास से प्रीमियम, सुविधा संपन्न परियोजनाओं पर ध्यान केंद्रित कर रहे हैं।"
    ],
    mattersToYou: "As someone tracking \"Real Estate India\", this indicates a structural shift in buyer preferences. If you are looking at property investments, premium segments currently offer better capital appreciation.",
    mattersToYouHi: "चूंकि आप \"भारतीय रियल एस्टेट\" को ट्रैक कर रहे हैं, यह खरीदार की प्राथमिकताओं में एक संरचनात्मक बदलाव का संकेत देता है। यदि आप संपत्ति निवेश देख रहे हैं, तो प्रीमियम सेगमेंट वर्तमान में बेहतर पूंजी प्रशंसा प्रदान करते हैं।",
    tags: ["REAL ESTATE", "PROPERTY", "LUXURY"],
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
    content: `India's real estate sector is witnessing an unprecedented boom, driven surprisingly by the luxury housing segment. Recent reports indicate that sales of homes priced above ₹4 crore have surged by a massive 75% year-on-year, with the National Capital Region (NCR) and Mumbai leading the charge.

This shift in consumer behavior is attributed to a post-pandemic desire for larger living spaces, better amenities, and upgraded lifestyles. Furthermore, a significant influx of investment from Non-Resident Indians (NRIs) looking to capitalize on the strong domestic economy and favorable exchange rates has fueled this demand.

In response, major developers are pivoting their strategies. The focus has noticeably shifted away from affordable housing projects towards premium and ultra-luxury developments. Industry experts predict this trend will continue, although they warn that the rapid price appreciation in certain micro-markets could lead to affordability concerns in the medium term.`,
    contentHi: `भारत का रियल एस्टेट क्षेत्र एक अभूतपूर्व उछाल देख रहा है, जो आश्चर्यजनक रूप से लक्जरी आवास खंड द्वारा संचालित है। हालिया रिपोर्टों से संकेत मिलता है कि ₹4 करोड़ से अधिक कीमत वाले घरों की बिक्री में साल-दर-साल 75% की भारी वृद्धि हुई है, जिसमें राष्ट्रीय राजधानी क्षेत्र (NCR) और मुंबई सबसे आगे हैं।

उपभोक्ता व्यवहार में इस बदलाव का श्रेय महामारी के बाद बड़े रहने की जगह, बेहतर सुविधाओं और उन्नत जीवन शैली की इच्छा को दिया जाता है। इसके अलावा, मजबूत घरेलू अर्थव्यवस्था और अनुकूल विनिमय दरों का लाभ उठाने के इच्छुक अनिवासी भारतीयों (NRI) के निवेश की एक महत्वपूर्ण आमद ने इस मांग को बढ़ावा दिया है।

जवाब में, प्रमुख डेवलपर्स अपनी रणनीतियों को बदल रहे हैं। ध्यान स्पष्ट रूप से किफायती आवास परियोजनाओं से हटकर प्रीमियम और अल्ट्रा-लक्जरी विकास की ओर हो गया है। उद्योग विशेषज्ञों का अनुमान है कि यह प्रवृत्ति जारी रहेगी, हालांकि वे चेतावनी देते हैं कि कुछ सूक्ष्म बाजारों में तेजी से मूल्य प्रशंसा मध्यम अवधि में सामर्थ्य की चिंताओं को जन्म दे सकती है।`
  },
  {
    id: '9',
    title: "Gold Prices Hit Historic Highs Amidst Global Uncertainty",
    titleHi: "वैश्विक अनिश्चितता के बीच सोने की कीमतें ऐतिहासिक ऊंचाई पर",
    category: "Commodities",
    categoryHi: "कमोडिटीज",
    readTime: "4 MIN READ",
    readTimeHi: "4 मिनट की पढ़ाई",
    updateInfo: "Market Alert",
    updateInfoHi: "बाजार अलर्ट",
    insights: [
      "Domestic gold prices have crossed ₹70,000 per 10 grams for the first time.",
      "Central bank buying and geopolitical tensions are the primary drivers of the global rally.",
      "Despite high prices, Indian retail demand remains resilient ahead of the festive season."
    ],
    insightsHi: [
      "घरेलू सोने की कीमतें पहली बार ₹70,000 प्रति 10 ग्राम को पार कर गई हैं।",
      "केंद्रीय बैंक की खरीदारी और भू-राजनीतिक तनाव वैश्विक रैली के प्राथमिक चालक हैं।",
      "उच्च कीमतों के बावजूद, त्योहारी सीजन से पहले भारतीय खुदरा मांग लचीली बनी हुई है।"
    ],
    mattersToYou: "With your focus on \"Wealth Management\", gold's performance highlights its role as a crucial hedge. Consider reviewing your portfolio's asset allocation to ensure adequate diversification.",
    mattersToYouHi: "\"वेल्थ मैनेजमेंट\" पर आपके ध्यान के साथ, सोने का प्रदर्शन एक महत्वपूर्ण बचाव के रूप में इसकी भूमिका को उजागर करता है। पर्याप्त विविधीकरण सुनिश्चित करने के लिए अपने पोर्टफोलियो के परिसंपत्ति आवंटन की समीक्षा करने पर विचार करें।",
    tags: ["GOLD", "COMMODITIES", "INVESTING"],
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=1000",
    content: `Gold has once again proven its status as the ultimate safe-haven asset, with domestic prices breaching the historic ₹70,000 per 10 grams mark. This remarkable rally is largely a reflection of international trends, where spot gold has reached unprecedented levels.

The surge is being driven by a confluence of factors. Persistent geopolitical tensions in the Middle East and Eastern Europe have sent investors flocking to the safety of bullion. Additionally, aggressive gold purchasing by central banks, particularly in emerging markets looking to diversify their reserves away from the US dollar, has provided strong underlying support to prices.

Interestingly, despite the steep prices, retail demand in India—the world's second-largest consumer of gold—remains surprisingly resilient. Jewelers report steady footfall as consumers prepare for the upcoming wedding and festive seasons, viewing gold not just as adornment but as a reliable store of value.`,
    contentHi: `सोने ने एक बार फिर अंतिम सुरक्षित-आश्रय संपत्ति के रूप में अपनी स्थिति साबित कर दी है, घरेलू कीमतों ने ऐतिहासिक ₹70,000 प्रति 10 ग्राम के आंकड़े को पार कर लिया है। यह उल्लेखनीय रैली काफी हद तक अंतरराष्ट्रीय रुझानों का प्रतिबिंब है, जहां हाजिर सोना अभूतपूर्व स्तर पर पहुंच गया है।

यह उछाल कई कारकों के संगम से प्रेरित है। मध्य पूर्व और पूर्वी यूरोप में लगातार भू-राजनीतिक तनाव ने निवेशकों को बुलियन की सुरक्षा की ओर झुका दिया है। इसके अतिरिक्त, केंद्रीय बैंकों द्वारा आक्रामक सोने की खरीदारी, विशेष रूप से उभरते बाजारों में जो अमेरिकी डॉलर से दूर अपने भंडार में विविधता लाना चाहते हैं, ने कीमतों को मजबूत अंतर्निहित समर्थन प्रदान किया है।

दिलचस्प बात यह है कि खड़ी कीमतों के बावजूद, भारत में खुदरा मांग—जो दुनिया का दूसरा सबसे बड़ा सोने का उपभोक्ता है—आश्चर्यजनक रूप से लचीली बनी हुई है। ज्वैलर्स आगामी शादी और त्योहारी सीजन की तैयारी कर रहे उपभोक्ताओं के रूप में स्थिर फुटफॉल की रिपोर्ट करते हैं, सोने को न केवल अलंकरण के रूप में बल्कि मूल्य के एक विश्वसनीय भंडार के रूप में देखते हैं।`
  },
  {
    id: '10',
    title: "Electric Vehicle Sales in India Cross 1.5 Million Mark in FY24",
    titleHi: "भारत में इलेक्ट्रिक वाहन की बिक्री FY24 में 1.5 मिलियन का आंकड़ा पार कर गई",
    category: "Automotive & EV",
    categoryHi: "ऑटोमोटिव और ईवी",
    readTime: "5 MIN READ",
    readTimeHi: "5 मिनट की पढ़ाई",
    updateInfo: "Green Economy",
    updateInfoHi: "हरित अर्थव्यवस्था",
    insights: [
      "Two-wheelers and three-wheelers dominate the EV adoption, accounting for over 90% of sales.",
      "The new EMPS (Electric Mobility Promotion Scheme) aims to sustain momentum after FAME II.",
      "Charging infrastructure remains a bottleneck for faster passenger car adoption."
    ],
    insightsHi: [
      "दोपहिया और तिपहिया वाहन ईवी अपनाने पर हावी हैं, जो बिक्री का 90% से अधिक हिस्सा हैं।",
      "नई EMPS (इलेक्ट्रिक मोबिलिटी प्रमोशन स्कीम) का उद्देश्य FAME II के बाद गति बनाए रखना है।",
      "तेजी से यात्री कार अपनाने के लिए चार्जिंग इंफ्रास्ट्रक्चर एक बाधा बना हुआ है।"
    ],
    mattersToYou: "Your tracking of \"Startup India\" intersects here. The EV ecosystem is ripe with opportunities for startups focusing on battery swapping, recycling, and localized component manufacturing.",
    mattersToYouHi: "\"स्टार्टअप इंडिया\" की आपकी ट्रैकिंग यहां प्रतिच्छेद करती है। ईवी पारिस्थितिकी तंत्र बैटरी स्वैपिंग, रीसाइक्लिंग और स्थानीयकृत घटक निर्माण पर ध्यान केंद्रित करने वाले स्टार्टअप के लिए अवसरों से भरा है।",
    tags: ["EV", "AUTO", "GREEN ENERGY"],
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=1000",
    content: `India's transition to electric mobility is accelerating faster than anticipated. In the financial year 2023-24, total Electric Vehicle (EV) sales crossed the 1.5 million milestone, marking a robust growth trajectory for the sector.

The charge is being led overwhelmingly by the two-wheeler and three-wheeler segments, which together account for more than 90% of total EV registrations. This adoption is driven by favorable economics, particularly the lower total cost of ownership for commercial operators and daily commuters.

While the conclusion of the FAME II subsidy scheme created some uncertainty, the government's timely introduction of the Electric Mobility Promotion Scheme (EMPS) 2024 has provided much-needed continuity. However, industry leaders emphasize that for electric passenger cars to see similar mass adoption, significant investments in a widespread and reliable charging infrastructure network are imperative.`,
    contentHi: `इलेक्ट्रिक मोबिलिटी की ओर भारत का संक्रमण अनुमान से अधिक तेजी से हो रहा है। वित्तीय वर्ष 2023-24 में, कुल इलेक्ट्रिक वाहन (EV) की बिक्री 1.5 मिलियन के मील के पत्थर को पार कर गई, जो इस क्षेत्र के लिए एक मजबूत विकास पथ को चिह्नित करती है।

इस चार्ज का नेतृत्व मुख्य रूप से दोपहिया और तिपहिया खंडों द्वारा किया जा रहा है, जो एक साथ कुल ईवी पंजीकरण का 90% से अधिक हिस्सा हैं। यह अपनाना अनुकूल अर्थशास्त्र द्वारा संचालित है, विशेष रूप से वाणिज्यिक ऑपरेटरों और दैनिक यात्रियों के लिए स्वामित्व की कम कुल लागत।

जबकि FAME II सब्सिडी योजना के समापन ने कुछ अनिश्चितता पैदा की, सरकार द्वारा इलेक्ट्रिक मोबिलिटी प्रमोशन स्कीम (EMPS) 2024 की समय पर शुरुआत ने बहुत आवश्यक निरंतरता प्रदान की है। हालांकि, उद्योग के नेता इस बात पर जोर देते हैं कि इलेक्ट्रिक यात्री कारों के लिए बड़े पैमाने पर अपनाने के लिए, एक व्यापक और विश्वसनीय चार्जिंग इंफ्रास्ट्रक्चर नेटवर्क में महत्वपूर्ण निवेश अनिवार्य है।`
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
