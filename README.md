# pop-select
A jQuery select altinative.

# Demo
See a demo from: https://codepen.io/toshiya14/pen/zmVwzJ

# Docs

## Basic Usage

* First of all, you should include libarary js into your html.

```
<link rel="stylesheet" type="text/css" href="pop-select.min.css">
<script src="pop-select.min.js">
```

* Initialize with a DOM node.

```
$("Selector").popselect(options);
```

* options is an object and can use follow fields:

<table>
  <tr>
    <th>Fields</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>direction</code><br/><i>String</i><br/>(Default: <code>auto</code>)</td>
    <td>Tell the control which direction would the option list&nbsp;should be shown.<br/>&nbsp;&nbsp;* <code>up</code>   - force place it above the select box.<br/>&nbsp;&nbsp;* <code>down</code> - force place it under the select box.<br/>&nbsp;&nbsp;* <code>auto</code> - determined by the position of the select.</td>
  </tr>
  <tr>
    <td><code>mobile</code><br/><i>String</i><br/>(Default: <code>default</code>)</td>
    <td>Which style would the option list be shown when using a mobile device.<br/>&nbsp; * <code>default</code> - the same with desktop.(Just popup)<br/>&nbsp; * <code>full</code>&nbsp; &nbsp; - show the option list full screen.<br/>&nbsp; * <code>native</code>&nbsp; - using native option list of the device.</td>
  </tr>
  <tr>
    <td><code>canSearch</code><br/><i>Boolean</i><br/>(Default: <code>false</code>)</td>
    <td>Make the select inputable and filter the options while typing. If <code>searchFields</code> is not set, all data fields would be used for filtering.</td>
  </tr>
  <tr>
    <td><code>searchFields</code><br/><i>Array</i><br/>(Default: <code>%html</code>)</td>
    <td>While <code>canSearch</code> is <code>true</code>, this field is used for filtering the option list with input text. If this field is not set or empty, all data fields would be used. Some special value could be used.<br/>Special values:<br/>&nbsp; * <code>%html</code>&nbsp; - search text within the rendered html. (With this value, keyword highlight is enabled.)<br/>&nbsp; * <code>%text</code>&nbsp; - search text within the rendered html. (With this value, keyword highlight is disabled.)</td>
  </tr>
  <tr>
    <td><code>displayField</code><br/><i>String</i><br/>(Default: <code>text</code>)</td>
    <td>This field would be used for displaying the options. If the <code>render</code> field is set, this field would be ignored. If the field does not exists in an item, <code>undefined</code> might be shown.</td>
  </tr>
  <tr>
    <td><code>groupField</code><br/><i>String</i><br/>(Default: <code>optgroup</code>)</td>
    <td>If options could grouped, this field tells which property could be used for group them.</td>
  </tr>
  <tr>
    <td><code>valueField</code><br/><i>String</i><br/>(Default: <code>value</code>)</td>
    <td>The name pf the property to use as the <code>value</code> when an option is selected.</td>
  </tr>
  <tr>
    <td><code>isMulti</code><br/><i>Boolean</i><br/>(Default: <code>false</code>)</td>
    <td>Make the select box could select multiple options.</td>
  </tr>
  <tr>
    <td><code>maxSelection</code><br/><i>Number</i><br/>(Default: <code>0</code>)</td>
    <td> If <code>isMulti</code> is <code>true</code>, this field limit the max select count. If this field is set to <code>0</code>, it means not limit.</td>
  </tr>
  <tr>
    <td><code>maxHeight</code><br/><i>String</i><br/>(Default: <code>300px</code>)</td>
    <td>Max height of the option list, if the height of the option list is over this limit, it would be scollable.</td>
  </tr>
  <tr>
    <td><code>render</code><br/><i>object</i><br/>(Default: <code>{}</code>)</td>
    <td>A function set to define the render methods. the value of each member must be a <code>function(item)</code>. The following key would be used:<br/>&nbsp; * <code>option</code>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; - How to render the options in the option list.<br/>&nbsp; * <code>selected</code>&nbsp; &nbsp; &nbsp; &nbsp; - The function to render selected item(s).<br/>&nbsp; * <code>group_header</code>&nbsp; &nbsp; - The function to render the header of each group.<br/>&nbsp; * <code>group_container</code> - The function to render the outer container of each group.</td>
  </tr>
  <tr>
    <td><code>emptyPlaceholder</code><br/><i>string</i><br/>(Default: <code>No items could be selected.</code>)</td>
    <td>While the option list is empty, use a helper text instead.</td>
  </tr>
  <tr>
    <td><code>data</code><br/><i>json</i><br/>(Default: <code>{}</code>)</td>
    <td>If this field is set, this json would be used for rendering the option list no matter what the original html looks like.</td>
  </tr>
</table>

## Other usage

```
$("Selector").popselect(action, options);
```

### Action: reload
```
$("Selector").popselect("reload", json);
```
use parameter `json` to rebuild the option list.

### Action: destroy
```
$("Selector").popselect("destroy");
```
roll back the select to original html.