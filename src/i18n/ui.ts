/**
 * Bilingual copy for the independent QIM developer signal lab.
 * Kept framework-free because the browser detector and the edge API both use it.
 */

export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'meta.title': 'QIM Developer Signal Lab | Independent Claude Environment Check',
    'meta.description':
      'A free, independent QIM public-interest tool that makes browser and network-region signals visible. Experimental results are not an Anthropic decision.',

    'nav.title': 'QIM Developer Signal Lab',
    'nav.product': 'Developer Signal Lab',
    'nav.evidence': 'Evidence',
    'nav.method': 'Method',
    'nav.about': 'About QIM',
    'credit': 'Independent research tool · not affiliated with Anthropic',

    'hero.eyebrow': 'A QIM public-interest developer project',
    'hero.title': 'See the environment signals your tools can expose.',
    'hero.lead':
      'Run a transparent, on-device check of regional browser signals. We show what is observed, what is only reported, and what remains a QIM research hypothesis.',
    'hero.notice':
      'This is an experimental environment-resemblance score—not an Anthropic risk score, account verdict, or way to predict enforcement.',
    'hero.affiliation':
      'Claude and Claude Code are trademarks of Anthropic, PBC. QIM is independent and is not affiliated with, endorsed by, or sponsored by Anthropic.',
    'hero.badge.local': 'Local scoring',
    'hero.badge.noUpload': 'No trackers or ads',
    'hero.badge.openSource': 'Open source · MIT',
    'hero.scoreOutOf': '/ 100',
    'score.label': 'Experimental resemblance score',

    'band.low.title': 'Few matching signals',
    'band.low.desc': 'Your browser showed few of the locally tested regional signals.',
    'band.medium.title': 'Mixed signal cluster',
    'band.medium.desc': 'Several browser signals matched, but this is not an identity or account conclusion.',
    'band.high.title': 'Strong signal cluster',
    'band.high.desc': 'Many local signals matched. This still does not show what Anthropic will decide.',
    'band.high.extra': 'Additional context',
    'band.high.extraSep': ', ',
    'band.high.extraSepLast': ' and ',

    'signal.timezone.name': 'System timezone',
    'signal.timezone.desc':
      'Reads the IANA timezone exposed by Intl.DateTimeFormat. Anthropic discloses timezone as a collected data category, but publishes no enforcement mapping or threshold.',
    'signal.language.name': 'Browser language',
    'signal.language.desc':
      'Reads navigator.languages. Language preference describes an environment, not a person, location, or account eligibility.',
    'signal.fonts.name': 'Installed Chinese fonts',
    'signal.fonts.desc':
      'Uses local canvas width comparisons to look for common Simplified and Traditional Chinese fonts.',
    'signal.vendorFonts.name': 'Regional software fonts',
    'signal.vendorFonts.desc':
      'Looks for fonts distributed with selected device vendors and Chinese-language software. This is only a correlation hypothesis.',
    'signal.cnBrowser.name': 'Browser or in-app WebView',
    'signal.cnBrowser.desc':
      'Checks browser-provided user-agent brands for selected regional browsers and app WebViews.',
    'signal.deviceVendor.name': 'Device vendor context',
    'signal.deviceVendor.desc':
      'Checks browser-provided device model hints for selected vendors. Global device sales make this an uncertain signal.',
    'signal.intlLocale.name': 'Intl locale',
    'signal.intlLocale.desc': 'Reads the locale used by the browser for date and number formatting.',
    'signal.timezoneOffset.name': 'UTC offset',
    'signal.timezoneOffset.desc': 'Compares the current local offset with UTC+8; many regions share this offset.',
    'signal.webrtcLeak.name': 'WebRTC exposure',
    'signal.webrtcLeak.desc':
      'Checks whether ICE candidates expose an address. This is privacy context only and does not change the score.',
    'signal.emoji.name': 'OS rendering context',
    'signal.emoji.desc':
      'Makes a coarse OS-family guess from browser headers. It is shown as context only and does not change the score.',

    'scan.detecting': 'Checking',
    'scan.ready': 'Ready to scan',
    'result.hitsTitle': 'Weighted signals observed',
    'result.noHits': 'No weighted signal crossed the match threshold.',
    'signals.title': 'Local signal scan',
    'signals.sub':
      'Four transparent locale signals form the experimental score; six browser, device, canvas, and network checks are zero-weight context.',

    'advanced.title': 'Include optional canvas and WebRTC checks',
    'advanced.body':
      'Off by default. If enabled, canvas checks local fonts and WebRTC may contact Google’s public STUN server. Neither affects the score.',
    'advanced.badge': 'Opt-in only',
    'advanced.skipped': 'not run (opt-in off)',

    'evidence.title': 'Evidence, without the guesswork',
    'evidence.sub':
      'The interface keeps official policy, third-party reporting, and QIM hypotheses in separate lanes.',
    'evidence.policy.title': 'Official policy',
    'evidence.policy.body':
      'Anthropic says it uses IP plus other signals for rough location, lists supported regions, and discloses data categories including timezone, ISP, OS, browser, payment, and identity information. It does not publish its complete enforcement classifier.',
    'evidence.policy.link': 'Anthropic supported regions',
    'evidence.location.link': 'Anthropic location disclosure',
    'evidence.privacy.link': 'Anthropic privacy policy',
    'evidence.report.title': 'Third-party report',
    'evidence.report.body':
      'The upstream project reports a Claude Code timezone/custom-endpoint mechanism. QIM has not found an Anthropic statement confirming the exact implementation.',
    'evidence.report.link': 'Review the upstream source',
    'evidence.hypothesis.title': 'QIM hypothesis layer',
    'evidence.hypothesis.body':
      'Language, fonts, browser, device, locale, and cross-signal clusters are transparent research hypotheses—not claims about Anthropic internals.',

    'hypotheses.title': 'Experimental hypothesis lab',
    'hypotheses.sub':
      'These interpretations update after a scan but never add points to the headline score.',
    'hypotheses.cluster.title': 'Cross-signal consistency',
    'hypotheses.cluster.body':
      'Checks whether timezone, language, locale, and UTC offset point in a similar direction.',
    'hypotheses.software.title': 'Regional software footprint',
    'hypotheses.software.body':
      'Combines font, browser/WebView, and device-vendor observations into a separate context flag.',
    'hypotheses.network.title': 'Edge network context',
    'hypotheses.network.body':
      'Shows the country code, timezone, and network organization Cloudflare attaches to this same-origin request. It is policy context, not proof of an Anthropic check.',
    'hypotheses.pending': 'Waiting for scan',
    'hypotheses.none': 'No cluster observed',
    'hypotheses.mixed': 'Mixed evidence',
    'hypotheses.observed': 'Cluster observed',
    'hypotheses.unavailable': 'Unavailable',
    'hypotheses.context': 'Context only',
    'hypotheses.footnote':
      'Important: this page sees the connection used to load QIM, not necessarily the egress used by Claude Code. No public source reveals Anthropic’s signal weights or enforcement threshold.',
    'network.timezoneDiff': 'browser and edge timezones differ',
    'network.timezoneMatch': 'browser and edge timezones align',
    'network.unlistedFocus': 'CN/HK/MO not listed by Anthropic · checked 2026-08-09',
    'network.listedTaiwan': 'Taiwan listed by Anthropic · checked 2026-08-09',
    'network.verifyList': 'verify eligibility on the current official list',

    'account.title': 'Signals this page cannot inspect',
    'account.sub':
      'Current Anthropic materials describe account-side checks that a public webpage cannot read. They stay out of the automated score.',
    'account.manual': 'MANUAL / NOT COLLECTED',
    'account.phone.title': 'Verified phone region',
    'account.phone.body':
      'New accounts require a supported-region phone number. QIM cannot read your Claude account or verified number.',
    'account.billing.title': 'Billing source and address',
    'account.billing.body':
      'Payment-source country and billing-address matching are account-side information and are never requested here.',
    'account.identity.title': 'Identity verification',
    'account.identity.body':
      'Persona document or selfie verification, when required, is private account data outside this tool’s scope.',
    'account.egress.title': 'Actual Claude Code egress',
    'account.egress.body':
      'Claude Code may use a corporate proxy or VPN, so its network path can differ from the browser connection shown here.',

    'how.title': 'How to read this result',
    'how.p1':
      'The browser scan runs after you press Start. Each signal is visible, weighted, and labeled by evidence tier. The score measures resemblance to a hand-built environment profile; it does not identify nationality, residence, or account status.',
    'how.p2':
      'A same-origin GET to the edge API displays Cloudflare country/timezone metadata already present when serving the page. No scan result, font list, or WebRTC candidate is sent to QIM. The app stores no result and loads no analytics, ads, or third-party fonts.',

    'faq.title': 'Questions worth asking',
    'faq.q1': 'Has Anthropic confirmed this exact detector?',
    'faq.a1':
      'No. Anthropic publishes region-availability rules, but QIM found no official source documenting this site’s ten-signal model. The timezone/custom-endpoint claim is a third-party report; the remaining correlations are labeled QIM hypotheses.',
    'faq.q2': 'Can a low score guarantee account access or safety?',
    'faq.a2':
      'No. A low score cannot guarantee access, prevent suspension, or predict any platform decision. Account, billing, network, abuse, and other server-side information are outside this page’s view.',
    'faq.q3': 'Is this a bypass or anti-ban tool?',
    'faq.a3':
      'No. It is a transparency and self-check tool. It does not change your device, account, network, or endpoint and does not recommend evading platform restrictions.',
    'faq.q4': 'What data leaves my browser?',
    'faq.a4':
      'The weighted scan stays local. The edge-context card makes a same-origin GET that receives normal IP-derived country/timezone metadata; the app does not store it. The WebRTC check may briefly contact Google’s public STUN server, and candidates remain local.',

    'privacy.title': 'Privacy boundary',
    'privacy.body':
      'No analytics, advertising, cookies, account login, or result storage. Local scan values stay in the browser. Edge country/timezone comes from the request already handled by Cloudflare; WebRTC may contact Google STUN only while scanning.',

    'public.title': 'Built as a QIM public-interest project',
    'public.body':
      'QIM provides this free tool to help developers inspect their environment and evaluate public claims more critically. It is independent, open source, and not affiliated with, endorsed by, or sponsored by Anthropic or Claude.',
    'public.disclaimer.title': 'Use and responsibility',
    'public.disclaimer.body':
      'Provided “as is” for research and reference. QIM makes no promise of accuracy, completeness, continuous availability, maintenance, support, updates, or fitness for a particular purpose. Users must follow applicable law and service terms; this tool does not provide or encourage bypassing regional, identity, or security controls. Users remain responsible for their decisions. To the maximum extent permitted by law, QIM is not liable for loss arising from use or reliance; nothing excludes liability that cannot legally be excluded.',

    'share.label': 'Share this experimental result',
    'share.native': 'Share',
    'share.copy': 'Copy link',
    'share.copied': 'Copied',
    'share.save': 'Save result image',
    'share.saved': 'Saved',
    'share.text':
      'My QIM experimental environment-resemblance score is {score}/100 — {verdict}. This is not an Anthropic verdict:',
    'share.to.x': 'Share on X',
    'share.to.weibo': 'Share on Weibo',
    'share.to.telegram': 'Share on Telegram',
    'share.to.facebook': 'Share on Facebook',
    'share.to.linkedin': 'Share on LinkedIn',
    'share.to.reddit': 'Share on Reddit',

    'api.title': 'Edge context over curl',
    'api.desc':
      'The read-only endpoint shows IP-derived country/timezone and request-header context. It is an estimate, returns no account data, and is not an Anthropic service.',
    'api.ex1': '# Text report — follows Accept-Language',
    'api.ex2': '# Force Chinese output',
    'api.ex3': '# Structured JSON output',

    'ui.weight': 'Weight',
    'ui.contextOnly': 'Context only',
    'ui.evidence.officialData': 'Officially disclosed data category',
    'ui.evidence.reported': 'Third-party reported',
    'ui.evidence.hypothesis': 'QIM hypothesis',
    'ui.evidence.context': 'Zero-weight context',
    'ui.claudeBadge': 'Third-party reported',
    'ui.retest': 'Scan again',
    'ui.start': 'Start local scan',

    'footer.disclaimer':
      'Independent QIM research project. Experimental output only; not an Anthropic or Claude decision.',
    'footer.license': 'MIT licensed. Original-project attribution retained.',
    'footer.qim': 'QIM',
    'footer.fork': 'QIM fork',
    'footer.repo': 'Upstream project',
    'footer.trademark':
      'Claude and Anthropic names belong to their respective owner. Their use here identifies the service being discussed and does not imply affiliation.',

    // Compatibility copy for currently unused upstream components.
    'sponsors.label': 'Sponsors',
    'sponsors.cta': 'Learn more',
    'cnModels.label': 'Other models',
    'cnModels.slogan': 'Explore alternatives',
    'social.x': 'X',
    'social.xiaohongshu': 'Xiaohongshu',
    'social.douyin': 'Douyin',
    'social.jike': 'Jike',
    'social.scan': 'Open',
  },

  zh: {
    'meta.title': 'QIM 开发者信号实验室｜独立 Claude 环境自查',
    'meta.description':
      'QIM 免费公益开发者工具，透明展示浏览器与网络区域信号。实验结果不代表 Anthropic 的判断。',

    'nav.title': 'QIM 开发者信号实验室',
    'nav.product': '开发者信号实验室',
    'nav.evidence': '证据说明',
    'nav.method': '检测方法',
    'nav.about': '关于 QIM',
    'credit': '独立研究工具 · 与 Anthropic 无关联',

    'hero.eyebrow': 'QIM 公益开发者项目',
    'hero.title': '看清开发工具可能暴露的环境信号。',
    'hero.lead':
      '在设备本地透明检查区域相关浏览器信号，并明确区分：实际观测、第三方报告与 QIM 研究假设。',
    'hero.notice':
      '这是实验性的「环境相似度」分数，不是 Anthropic 风险分、账号结论，也不能预测平台执法。',
    'hero.affiliation':
      'Claude 与 Claude Code 是 Anthropic, PBC 的商标。QIM 为独立项目，与 Anthropic 没有隶属、认可、赞助或背书关系。',
    'hero.badge.local': '本地计分',
    'hero.badge.noUpload': '无分析与广告',
    'hero.badge.openSource': '开源 · MIT',
    'hero.scoreOutOf': '/ 100',
    'score.label': '实验性环境相似度',

    'band.low.title': '少量匹配信号',
    'band.low.desc': '浏览器只显示少量本地测试的区域相关信号。',
    'band.medium.title': '混合信号组合',
    'band.medium.desc': '有多项浏览器信号匹配，但这不是身份或账号结论。',
    'band.high.title': '明显信号组合',
    'band.high.desc': '多项本地信号匹配，但仍不能代表 Anthropic 会如何判断。',
    'band.high.extra': '补充信息',
    'band.high.extraSep': '、',
    'band.high.extraSepLast': ' 和 ',

    'signal.timezone.name': '系统时区',
    'signal.timezone.desc':
      '读取 Intl.DateTimeFormat 暴露的 IANA 时区。Anthropic 披露会收集时区这一数据类别，但没有公开执法映射或门槛。',
    'signal.language.name': '浏览器语言',
    'signal.language.desc':
      '读取 navigator.languages。语言偏好只能描述环境，不能证明个人身份、所在地或账号资格。',
    'signal.fonts.name': '已安装中文字体',
    'signal.fonts.desc': '通过本地 canvas 宽度比较，查找常见简体与繁体中文字体。',
    'signal.vendorFonts.name': '区域软件字体',
    'signal.vendorFonts.desc':
      '查找部分设备厂商及中文软件附带的字体；这只是相关性假设。',
    'signal.cnBrowser.name': '浏览器或应用 WebView',
    'signal.cnBrowser.desc': '从浏览器提供的 UA 品牌信息识别部分区域浏览器与应用内 WebView。',
    'signal.deviceVendor.name': '设备厂商信息',
    'signal.deviceVendor.desc':
      '从浏览器提供的设备型号提示识别部分厂商；设备全球销售使该信号存在明显不确定性。',
    'signal.intlLocale.name': 'Intl 区域设置',
    'signal.intlLocale.desc': '读取浏览器用于日期及数字格式化的 locale。',
    'signal.timezoneOffset.name': 'UTC 偏移',
    'signal.timezoneOffset.desc': '比较当前本地偏移是否为 UTC+8；许多地区共用此偏移。',
    'signal.webrtcLeak.name': 'WebRTC 暴露面',
    'signal.webrtcLeak.desc':
      '检查 ICE candidate 是否暴露地址。只作隐私背景信息，不影响分数。',
    'signal.emoji.name': '系统渲染背景',
    'signal.emoji.desc': '从浏览器标头粗略推测系统类别；只作背景信息，不影响分数。',

    'scan.detecting': '检测中',
    'scan.ready': '等待检测',
    'result.hitsTitle': '观测到的加权信号',
    'result.noHits': '没有加权信号超过匹配门槛。',
    'signals.title': '本地信号扫描',
    'signals.sub': '四项透明的 locale 信号构成实验分数；另外六项浏览器、设备、canvas 与网络检查权重为零。',

    'advanced.title': '加入可选的 canvas 与 WebRTC 检查',
    'advanced.body':
      '默认关闭。启用后，canvas 会检查本地字体，WebRTC 可能连接 Google 公共 STUN；两者均不影响分数。',
    'advanced.badge': '须主动启用',
    'advanced.skipped': '未运行（未启用）',

    'evidence.title': '把证据与猜测分开',
    'evidence.sub': '官方政策、第三方报告与 QIM 假设分别展示，不混为一谈。',
    'evidence.policy.title': '官方政策',
    'evidence.policy.body':
      'Anthropic 表示会用 IP 加其他信号估算大致位置，并公开支持地区；其政策亦列出时区、ISP、系统、浏览器、付款及身份资料等类别，但没有公开完整风控分类器。',
    'evidence.policy.link': 'Anthropic 支持地区',
    'evidence.location.link': 'Anthropic 位置资料说明',
    'evidence.privacy.link': 'Anthropic 隐私政策',
    'evidence.report.title': '第三方报告',
    'evidence.report.body':
      '上游项目报告了 Claude Code 的时区／自定义端点机制；QIM 未找到 Anthropic 对该具体实现的公开确认。',
    'evidence.report.link': '查看上游来源',
    'evidence.hypothesis.title': 'QIM 假设层',
    'evidence.hypothesis.body':
      '语言、字体、浏览器、设备、locale 与组合信号都是透明的研究假设，并非对 Anthropic 内部机制的断言。',

    'hypotheses.title': '实验性假设区',
    'hypotheses.sub': '扫描后会更新这些解释，但它们不会给主分数额外加分。',
    'hypotheses.cluster.title': '跨信号一致性',
    'hypotheses.cluster.body': '查看时区、语言、locale 与 UTC 偏移是否指向相近环境。',
    'hypotheses.software.title': '区域软件痕迹',
    'hypotheses.software.body': '把字体、浏览器／WebView 与设备厂商观测合并成独立背景标记。',
    'hypotheses.network.title': '边缘网络背景',
    'hypotheses.network.body':
      '显示 Cloudflare 附加到同源请求的国家代码、时区与网络机构；这是政策背景，不是 Anthropic 检查的证据。',
    'hypotheses.pending': '等待扫描',
    'hypotheses.none': '未见组合信号',
    'hypotheses.mixed': '证据混合',
    'hypotheses.observed': '见到组合信号',
    'hypotheses.unavailable': '无法取得',
    'hypotheses.context': '仅作背景',
    'hypotheses.footnote':
      '注意：本站看到的是加载 QIM 的连接，不一定等于 Claude Code 的实际出口。公开资料没有 Anthropic 的信号权重或处置门槛。',
    'network.timezoneDiff': '浏览器与边缘时区不同',
    'network.timezoneMatch': '浏览器与边缘时区一致',
    'network.unlistedFocus': '中／港／澳未列入 Anthropic 名单 · 核对于 2026-08-09',
    'network.listedTaiwan': '台湾列入 Anthropic 名单 · 核对于 2026-08-09',
    'network.verifyList': '请以最新官方名单核对资格',

    'account.title': '网页无法检查的信号',
    'account.sub': 'Anthropic 最新资料还描述了账号侧检查；公共网页无法读取，因此不会放进自动分数。',
    'account.manual': '人工核对／本站不收集',
    'account.phone.title': '已验证电话号码地区',
    'account.phone.body': '新账号须使用受支持地区号码；QIM 无法读取 Claude 账号或已验证号码。',
    'account.billing.title': '付款来源与账单地址',
    'account.billing.body': '付款来源国家及账单地址匹配属于账号侧资料，本站不会要求提供。',
    'account.identity.title': '身份验证',
    'account.identity.body': 'Persona 证件或自拍验证（如适用）属于私密账号资料，不在本工具范围内。',
    'account.egress.title': 'Claude Code 实际出口',
    'account.egress.body': 'Claude Code 可使用企业代理或 VPN，实际网络路径可能与本站显示的浏览器连接不同。',

    'how.title': '如何理解结果',
    'how.p1':
      '点击开始后才会运行浏览器扫描。每项信号都会显示数值、权重和证据级别。分数只表示与人工环境画像的相似度，不能识别国籍、居住地或账号状态。',
    'how.p2':
      '同源 GET 会显示 Cloudflare 在提供本页时已有的国家／时区元数据。扫描结果、字体清单与 WebRTC candidate 不会发给 QIM；应用不保存结果，也不加载分析、广告或第三方字体。',

    'faq.title': '值得先问的问题',
    'faq.q1': 'Anthropic 确认过这套检测吗？',
    'faq.a1':
      '没有。Anthropic 公开了地区可用性规则，但 QIM 没有找到官方来源说明本站这套十项模型。时区／自定义端点属于第三方报告，其余相关性均标为 QIM 假设。',
    'faq.q2': '低分能保证账号可用或安全吗？',
    'faq.a2':
      '不能。低分无法保证可访问、避免停权或预测平台决定。账号、支付、网络、滥用及其他服务端信息都不在网页可见范围内。',
    'faq.q3': '这是绕过限制或“防封”工具吗？',
    'faq.a3':
      '不是。这是透明度与环境自查工具，不会修改设备、账号、网络或端点，也不建议规避平台限制。',
    'faq.q4': '哪些数据会离开浏览器？',
    'faq.a4':
      '加权扫描留在本地。边缘背景卡会发出同源 GET，只接收正常请求已有的 IP 衍生国家／时区元数据，应用不作保存。WebRTC 检查可能短暂连接 Google 公共 STUN，candidate 仍留在本地。',

    'privacy.title': '隐私边界',
    'privacy.body':
      '无分析、广告、Cookie、账号登录或结果存储。本地扫描值留在浏览器；边缘国家／时区来自 Cloudflare 已处理的请求；WebRTC 只在扫描时可能连接 Google STUN。',

    'public.title': 'QIM 公益项目，为开发者而做',
    'public.body':
      'QIM 免费提供本工具，帮助开发者检查环境，并更审慎地评估公开说法。项目独立、开源，与 Anthropic 或 Claude 没有隶属、认可或赞助关系。',
    'public.disclaimer.title': '使用与责任',
    'public.disclaimer.body':
      '本工具按「现状」提供，仅供研究与参考。QIM 不保证准确、完整、持续可用、维护、支援、更新或适合特定用途。使用者须遵守适用法律与服务条款；本工具不提供或鼓励绕过地区、身份或安全限制的方法。使用者须自行判断并对决定负责；在适用法律允许的最大范围内，QIM 不对因使用或依赖本工具产生的损失负责。法律不能排除的责任不受本声明影响。',

    'share.label': '分享实验结果',
    'share.native': '分享',
    'share.copy': '复制链接',
    'share.copied': '已复制',
    'share.save': '保存结果图片',
    'share.saved': '已保存',
    'share.text':
      '我的 QIM 实验性环境相似度为 {score}/100 —— {verdict}。这不是 Anthropic 的结论：',
    'share.to.x': '分享到 X',
    'share.to.weibo': '分享到微博',
    'share.to.telegram': '分享到 Telegram',
    'share.to.facebook': '分享到 Facebook',
    'share.to.linkedin': '分享到 LinkedIn',
    'share.to.reddit': '分享到 Reddit',

    'api.title': '通过 curl 查看边缘背景',
    'api.desc':
      '只读接口显示 IP 衍生国家／时区与请求头背景。它只是估算，不返回账号数据，也不是 Anthropic 服务。',
    'api.ex1': '# 文本报告 —— 跟随 Accept-Language',
    'api.ex2': '# 强制中文输出',
    'api.ex3': '# 结构化 JSON 输出',

    'ui.weight': '权重',
    'ui.contextOnly': '背景信息',
    'ui.evidence.officialData': '官方披露的数据类别',
    'ui.evidence.reported': '第三方报告',
    'ui.evidence.hypothesis': 'QIM 假设',
    'ui.evidence.context': '零权重背景',
    'ui.claudeBadge': '第三方报告',
    'ui.retest': '重新扫描',
    'ui.start': '开始本地扫描',

    'footer.disclaimer': 'QIM 独立研究项目。仅为实验结果，不代表 Anthropic 或 Claude 判断。',
    'footer.license': 'MIT 开源，并保留原项目署名。',
    'footer.qim': 'QIM',
    'footer.fork': 'QIM fork',
    'footer.repo': '上游项目',
    'footer.trademark':
      'Claude 与 Anthropic 名称归其权利人所有；本站仅用于说明所讨论的服务，不表示任何关联。',

    'sponsors.label': '赞助',
    'sponsors.cta': '了解更多',
    'cnModels.label': '其他模型',
    'cnModels.slogan': '探索替代方案',
    'social.x': 'X',
    'social.xiaohongshu': '小红书',
    'social.douyin': '抖音',
    'social.jike': '即刻',
    'social.scan': '打开',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

/** Returns a translator that falls back to English, then to the raw key. */
export function useTranslations(lang: Lang) {
  const table = ui[lang] ?? ui[defaultLang];
  return function t(key: string): string {
    return (
      (table as Record<string, string>)[key] ??
      (ui[defaultLang] as Record<string, string>)[key] ??
      key
    );
  };
}

/** `/` for English (default), `/zh/` for Chinese. */
export function localePath(lang: Lang): string {
  return lang === defaultLang ? '/' : `/${lang}/`;
}

/** Detect the current language from an Astro request URL. */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg && seg in languages) return seg as Lang;
  return defaultLang;
}
