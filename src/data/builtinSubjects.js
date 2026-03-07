export const builtinSubjects = [
  {
    id: "security-plus",
    title: "CompTIA Security+",
    shortTitle: "Sec+",
    description: "CompTIA Security+ certification study materials covering all exam domains.",
    icon: "🔐",
    color: "#FF4B4B",
    builtin: true,
    modules: [
      {
        id: "sec-threats",
        title: "Threats, Attacks & Vulnerabilities",
        shortTitle: "Threats",
        color: "#FF6B6B",
        decks: [
          {
            id: "sec-malware",
            title: "Types of Malware",
            cards: [
              {
                id: "c1",
                topic: "Ransomware",
                definition: "Malware that encrypts victim's files and demands payment for decryption key.",
                keyPoints: [
                  { point: "Encryption", brief: "Uses strong asymmetric encryption to lock files" },
                  { point: "Payment", brief: "Typically demands cryptocurrency payment" },
                  { point: "Prevention", brief: "Regular backups are the best defense" }
                ],
                examTip: "Know the difference between ransomware and cryptojacking.",
                tags: ["malware", "encryption", "threats"]
              },
              {
                id: "c2",
                topic: "Trojan Horse",
                definition: "Malicious software disguised as legitimate software to trick users into installing it.",
                keyPoints: [
                  { point: "Disguise", brief: "Appears as legitimate/useful software" },
                  { point: "Backdoor", brief: "Often creates backdoor for attacker access" },
                  { point: "RAT", brief: "Remote Access Trojans provide full control" }
                ],
                examTip: "Trojans require user interaction to install, unlike worms.",
                tags: ["malware", "social-engineering"]
              }
            ]
          },
          {
            id: "sec-attacks",
            title: "Social Engineering Attacks",
            cards: [
              {
                id: "c3",
                topic: "Phishing",
                definition: "Fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity via email.",
                keyPoints: [
                  { point: "Email-based", brief: "Primary vector is deceptive emails" },
                  { point: "Spear phishing", brief: "Targeted phishing at specific individuals" },
                  { point: "Whaling", brief: "Phishing targeting executives (big fish)" }
                ],
                examTip: "Spear phishing is targeted; regular phishing is broad.",
                tags: ["social-engineering", "email"]
              }
            ]
          }
        ]
      },
      {
        id: "sec-crypto",
        title: "Cryptography & PKI",
        shortTitle: "Crypto",
        color: "#FF8C42",
        decks: [
          {
            id: "sec-symmetric",
            title: "Symmetric Encryption",
            cards: [
              {
                id: "c4",
                topic: "AES",
                definition: "Advanced Encryption Standard — the most widely used symmetric encryption algorithm.",
                keyPoints: [
                  { point: "Key sizes", brief: "128, 192, or 256-bit keys" },
                  { point: "Block cipher", brief: "Operates on 128-bit blocks" },
                  { point: "Modes", brief: "ECB, CBC, CTR, GCM modes available" }
                ],
                examTip: "AES-256 is the gold standard for symmetric encryption.",
                tags: ["cryptography", "symmetric", "AES"]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "network-plus",
    title: "CompTIA Network+",
    shortTitle: "Net+",
    description: "CompTIA Network+ certification covering networking concepts and infrastructure.",
    icon: "🌐",
    color: "#58CC02",
    builtin: true,
    modules: [
      {
        id: "net-fundamentals",
        title: "Networking Fundamentals",
        shortTitle: "Fundamentals",
        color: "#5EDB47",
        decks: [
          {
            id: "net-osi",
            title: "OSI Model",
            cards: [
              {
                id: "c5",
                topic: "OSI Model Layers",
                definition: "The Open Systems Interconnection model defines 7 layers of network communication.",
                keyPoints: [
                  { point: "Layer 1 - Physical", brief: "Cables, hubs, electrical signals" },
                  { point: "Layer 2 - Data Link", brief: "MAC addresses, switches, frames" },
                  { point: "Layer 3 - Network", brief: "IP addresses, routers, packets" },
                  { point: "Layer 4 - Transport", brief: "TCP/UDP, ports, segments" },
                  { point: "Layer 7 - Application", brief: "HTTP, FTP, DNS, user-facing protocols" }
                ],
                examTip: "Remember: Please Do Not Throw Sausage Pizza Away (Physical, Data Link, Network, Transport, Session, Presentation, Application)",
                tags: ["OSI", "networking", "layers"]
              }
            ]
          },
          {
            id: "net-tcp-ip",
            title: "TCP/IP",
            cards: [
              {
                id: "c6",
                topic: "TCP Three-Way Handshake",
                definition: "The process TCP uses to establish a connection between client and server.",
                keyPoints: [
                  { point: "SYN", brief: "Client sends synchronize packet to server" },
                  { point: "SYN-ACK", brief: "Server acknowledges and sends its own SYN" },
                  { point: "ACK", brief: "Client acknowledges server's SYN, connection established" }
                ],
                examTip: "SYN flood attacks exploit the half-open connection state.",
                tags: ["TCP", "handshake", "networking"]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "owasp-top10",
    title: "OWASP Top 10",
    shortTitle: "OWASP",
    description: "The OWASP Top 10 most critical web application security risks.",
    icon: "🕷️",
    color: "#1CB0F6",
    builtin: true,
    modules: [
      {
        id: "owasp-injection",
        title: "Injection Vulnerabilities",
        shortTitle: "Injection",
        color: "#1CB0F6",
        decks: [
          {
            id: "owasp-sqli",
            title: "SQL Injection",
            cards: [
              {
                id: "c7",
                topic: "SQL Injection",
                definition: "An attack where malicious SQL statements are inserted into an entry field for execution.",
                keyPoints: [
                  { point: "Error-based", brief: "Extracts info from database error messages" },
                  { point: "Blind SQLi", brief: "No visible output; infer results from app behavior" },
                  { point: "Prevention", brief: "Use parameterized queries / prepared statements" }
                ],
                examTip: "Always use prepared statements — never concatenate user input into SQL.",
                tags: ["OWASP", "injection", "SQL", "web-security"]
              }
            ]
          }
        ]
      },
      {
        id: "owasp-xss",
        title: "Cross-Site Scripting",
        shortTitle: "XSS",
        color: "#4C97FF",
        decks: [
          {
            id: "owasp-xss-types",
            title: "XSS Types",
            cards: [
              {
                id: "c8",
                topic: "Reflected XSS",
                definition: "XSS where the malicious script is reflected off the web server in an immediate response.",
                keyPoints: [
                  { point: "Non-persistent", brief: "Not stored; only affects users who click malicious link" },
                  { point: "URL-based", brief: "Script embedded in URL parameter" },
                  { point: "Prevention", brief: "Encode all user-supplied output" }
                ],
                examTip: "Reflected XSS requires the victim to click a crafted link.",
                tags: ["XSS", "OWASP", "web-security"]
              }
            ]
          }
        ]
      }
    ]
  }
];
