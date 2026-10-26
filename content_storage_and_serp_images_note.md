# Technical Note: Content Data Storage & `serp_images` Usage

This document explains how user content (including images) is currently stored, how the save API operates, and why the `serp_images` field is unused and can be repurposed.

---

## 1. Executive Summary

* **Where images in content are stored:** When a user copies/pastes an image or pastes an external image URL into the editor, the image is stored directly inside the text body field: **`ai_response_content`** (as Markdown or inline HTML).
* **Does `serp_images` store these images?** **No.** `serp_images` is completely bypassed during content creation and editing.
* **Is `serp_images` used on the frontend?** **No.** It is neither rendered on the UI nor submitted in any content save request. It is safe to repurpose or replace.

---

## 2. How Images in Content Are Actually Stored

Users insert images into content in two primary ways:

| Image Input Method | What Happens in the Editor | Where It Gets Saved in the Database |
| :--- | :--- | :--- |
| **1. Copy & paste image directly** | Converted into an inline base64 data URI (`data:image/png;base64,...`) or an HTML `<img>` tag in the editor. | Embedded directly inside the string field **`ai_response_content`**. |
| **2. Paste image link from outside** | Inserted as a Markdown image tag `![alt](https://...)` or HTML `src` link. | Embedded directly inside the string field **`ai_response_content`**. |

Neither method interacts with or populates `serp_images`.

---

## 3. The Content Save API (`PUT /tool/update-history`)

When a user edits or saves content from the tool detail page or content editor, the frontend calls **`saveGeneratedFormOutputApi`** ([tools.api.ts](file:///d:/Office_work_2/teachbetter-ai-frontend/TeachBetter-Frontend/src/features/tools/tools.api.ts#L104-L113)):

### Endpoint
```http
PUT /tool/update-history
```

### Request Payload Sent by Frontend
```json
{
  "history_id": 4033,
  "tool_id": 12,
  "ai_response_content": "## Lesson Plan\n\n![Diagram](https://example.com/image.png)\n\nHere is the lesson content...",
  "conversation_history": [
    { "role": "user", "content": "Generate a lesson plan" },
    { "role": "assistant", "content": "..." }
  ]
}
```

> [!NOTE]
> As seen in the payload above, **neither `serp_images` nor `serp_image_data` is sent** when saving content. Everything created or pasted by the user is inside `ai_response_content`.

---

## 4. What Are `serp_images` and `serp_image_data`?

Both fields originate from the **Google / SERP web search tool**, which allows users to search web media:

| Field Name | Type | Description | Current Status |
| :--- | :--- | :--- | :--- |
| **`serp_images`** | `string[]` | A plain array of raw image URLs: `["https://.../img1.jpg", "https://.../img2.jpg"]`. | **Legacy / Unused.** Originally created before thumbnails were introduced. |
| **`serp_image_data`** | `{ thumbnail: string, url: string }[]` | A structured array containing both the preview thumbnail and full image URL. | **Active format on backend.** Used when saving Google search media. |

### How Media Was Saved in the SERP Flow
When a user used the SERP web search feature and explicitly clicked "Save Media", a dedicated separate endpoint was called:
```http
POST /serp/save-media
```
Payload:
```json
{
  "history_id": 4033,
  "media_type": "image",
  "url": "https://example.com/highres.jpg",
  "thumbnail": "https://example.com/thumb.jpg"
}
```
The backend recorded this media attached to `history_id`. When retrieving the content detail (`GET /content/detail?history_id=...`), the backend returned both `serp_image_data` and a flattened list `serp_images`.

---

## 5. Current Frontend Code Status

1. **`serp_images` in the codebase:**
   - Only declared in the TypeScript interface `GetMyContentDetailOutput` ([content.type.ts](file:///d:/Office_work_2/teachbetter-ai-frontend/TeachBetter-Frontend/src/features/my-content/content.type.ts#L56)).
   - **0 references** in any UI components or API request payloads across the entire frontend.
2. **On Page `https://stage-myspace.teachbetter.ai/app/my-content/4033`:**
   - The `<VideosAndImages />` component has been commented out and disabled in [MyContentDetail.tsx](file:///d:/Office_work_2/teachbetter-ai-frontend/TeachBetter-Frontend/src/components/my-content-detail/MyContentDetail.tsx).
   - As a result, neither `serp_images` nor `serp_image_data` is currently displayed or used on the page.

---

## 6. Recommendations for Repurposing `serp_images`

If you would like to use this field for other features:
1. **Frontend side:** You can immediately use or remap this field; nothing in the frontend will break.
2. **Backend side:** Verify the backend save endpoint (`/tool/update-history` or `/content`) accepts and persists the new values, and doesn't overwrite it with the legacy SERP table lookup.
3. **Best Practice:** If introducing a completely new feature (e.g. user-uploaded cover images or tool metadata), consider introducing a clearly named field (e.g. `cover_image` or `custom_media`) to avoid mixing up legacy SERP search records.
