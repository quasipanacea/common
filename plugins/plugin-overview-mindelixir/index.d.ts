// dom.d.ts
interface Element {
	setAttribute(name: string, value: boolean): void
	setAttribute(name: string, value: number): void
}

interface Wrapper extends HTMLElement {
	parentNode: Children
	parentElement: Children
	offsetParent: Wrapper
	nextSibling: Wrapper | undefined
}

interface Parent extends HTMLElement {
	parentNode: Wrapper
	parentElement: Wrapper
	nextSibling: Children
}

interface Children extends HTMLElement {
	parentNode: Wrapper
	parentElement: Wrapper
	previousSibling: Parent
}

interface Topic extends HTMLElement {
	nodeObj?: NodeObj
	linkContainer?: HTMLElement
	parentNode: Parent
	parentElement: Parent
}

interface Expander extends HTMLElement {
	expanded?: boolean
	parentNode: Parent
	parentElement: Parent
}

interface CustomSvg extends SVGElement {
	linkObj?: object
}

// function.d.ts
type CreateInputDiv = (this: MindElixirInstance, el: Topic) => void
type CreateWrapper = (
	this: MindElixirInstance,
	nodeObj: NodeObj,
	omitChildren?: boolean,
) => {
	grp: Wrapper
	top: Parent
}
type CreateChildren = (
	this: MindElixirInstance,
	wrappers: Wrapper[],
) => Children
type CreateParent = (this: MindElixirInstance, nodeObj: NodeObj) => Parent
type CreateTopic = (this: MindElixirInstance, nodeObj: NodeObj) => Topic

type TNodeOperation = (
	this: MindElixirInstance,
	el?: Topic,
	node?: NodeObj,
) => void
type TNodeMove = (this: MindElixirInstance, from: Topic, to?: Topic) => void
type TNodeCopy = (this: MindElixirInstance, node: Topic, to: Topic) => void
type AddChildFunction = (
	this: MindElixirInstance,
	nodeEle: Topic,
	node: NodeObj,
) => {
	newTop: Parent
	newNodeObj: NodeObj
}
type ReshapeNode = (
	this: MindElixirInstance,
	tpc: Topic,
	patchData: NodeObj,
) => void

type Layout = (this: MindElixirInstance) => void
type LayoutChildren = (
	this: MindElixirInstance,
	data: NodeObj[],
	container?: Children,
	direction?,
) => Children
type LinkDiv = (this: MindElixirInstance, mainNode?: Wrapper) => void
type TraverseChildrenFunc = (
	children: HTMLCollection,
	parent: Parent,
	isFirst?: boolean,
) => string
type JudgeDirection = (
	this: MindElixirInstance,
	mainNode: Wrapper,
	obj: NodeObj,
) => void

type ExpandNode = (
	this: MindElixirInstance,
	el: Topic,
	isExpand: boolean,
) => void
type SelectNodeFunc = (
	this: MindElixirInstance,
	targetElement: Topic,
	isNewNode?: boolean,
	e?: MouseEvent,
) => void
type CommonSelectFunc = (this: MindElixirInstance) => void
type SiblingSelectFunc = (this: MindElixirInstance) => boolean

type GetDataStringFunc = (this: MindElixirInstance) => string
type GetDataFunc = (this: MindElixirInstance) => MindElixirData

type RefreshFunc = (this: MindElixirInstance, data: MindElixirData) => void

// index.d.ts
type operation = {
	name: string
}

interface Theme {
	name: string
	palette: string[]
	cssVar: {
		'--main-color': string
		'--main-bgcolor': string
		'--color': string
		'--bgcolor': string
	}
}

interface MindElixirInstance {
	mindElixirBox: HTMLElement
	nodeData: NodeObj
	linkData: LinkObj
	currentNode: Topic | null
	currentLink: SVGElement | null
	inputDiv: HTMLElement | null
	scaleVal: number
	tempDirection: number | null

	// wip
	bus: {
		addListener: (type: string, handler) => void
		fire: (type: string, ...payload) => void
	}

	// wip
	history: operation[]
	isUndo: boolean
	undo: () => void

	theme: Theme
	direction: number
	locale: string
	draggable: boolean
	editable: boolean
	contextMenu: boolean
	contextMenuOption: object
	toolBar: boolean
	keypress: boolean
	before: object
	newTopicName: string
	allowUndo: boolean
	overflowHidden: boolean
	mainLinkStyle: number
	mainNodeHorizontalGap: number
	mainNodeVerticalGap: number
	mobileMenu: boolean

	container: HTMLElement
	map: HTMLElement
	root: HTMLElement
	mainNodes: HTMLElement
	lines: SVGElement
	linkController: SVGElement
	P2: HTMLElement
	P3: HTMLElement
	line1: SVGElement
	line2: SVGElement
	linkSvgGroup: SVGElement

	generateNewObj: () => NodeObj
	createWrapper: CreateWrapper
	createParent: CreateParent
	createChildren: CreateChildren
	createTopic: CreateTopic

	linkDiv: LinkDiv
	judgeDirection: JudgeDirection

	addChild: TNodeOperation
	createInputDiv: CreateInputDiv
	layoutChildren: LayoutChildren

	selectNode: SelectNodeFunc
	unselectNode: CommonSelectFunc
	selectNextSibling: SiblingSelectFunc
	selectPrevSibling: SiblingSelectFunc
	selectFirstChild: CommonSelectFunc
	selectParent: CommonSelectFunc
	getDataString: GetDataStringFunc
	getData: GetDataFunc
	getDataMd: GetDataStringFunc
	scale
	toCenter
	focusNode
	cancelFocus
	initLeft
	initRight
	initSide
	setLocale
	enableEdit
	disableEdit
	expandNode: ExpandNode
	refresh

	layout: Layout
	removeLink
	addParentLink
}

interface Options {
	el: string | HTMLElement
	data: MindElixirData
	direction?: number
	locale?: string
	draggable?: boolean
	editable?: boolean
	contextMenu?: boolean
	contextMenuOption?: object
	toolBar?: boolean
	keypress?: boolean
	before?: object
	newTopicName?: string
	allowUndo?: boolean
	overflowHidden?: boolean
	mainLinkStyle?: number
	mainNodeHorizontalGap?: number
	mainNodeVerticalGap?: number
	mobileMenu?: boolean
	theme?: Theme
}
interface NodeObj {
	topic: string
	id: string
	style?: {
		fontSize?: string
		color?: string
		background?: string
		fontWeight?: string
	}
	parent?: NodeObj
	children?: NodeObj[]
	tags?: string[]
	icons?: string[]
	hyperLink?: string
	expanded?: boolean
	direction?: number
	root?: boolean
	image?: {
		url: string
		width: number
		height: number
	}
	// main node specific properties
	branchColor?: string
}

type LinkObj = object

interface MindElixirData {
	nodeData: NodeObj
	linkData?: LinkObj
	direction?: number
	theme?: Theme
}

module 'mind-elixir' {
	declare function findEle(id: string, instance?: any): Element

	export declare interface MindElixirOptions {
		/**
		 * The HTML Element controlled by MindElixir.
		 */
		el: string | HTMLDivElement

		/**
		 * The direction of <it>.
		 */
		direction: number

		/**
		 * Whether or not to make <it> draggable.
		 */
		draggable: boolean

		/**
		 * If <it> should add a context menu.
		 */
		contextMenu: boolean

		// ...
		[key: string]: any
	}

	declare interface MindElixir {
		init(data: MindElixirData): void
	}
	declare var MindElixir: {
		new (options: MindElixirOptions): MindElixir
		_new(topic: string): MindElixirData

		LEFT: 0
		RIGHT: 1
		SIDE: 2
		version: string
	}

	export default MindElixir
	export declare var E = findEle
}
